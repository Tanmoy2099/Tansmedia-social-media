import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { parseCookies } from 'nookies';
import cookie from 'js-cookie';
import { useRouter } from 'next/router';
import { io } from 'socket.io-client';
import { Box, Drawer, IconButton, Paper, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';


import getUserInfo from '../utils/getUserInfo';
import Message from '../components/Notifications/Messages/Message';
import baseUrl, { pureBaseUrl } from '../utils/baseUrl';
import newMsgSound from '../utils/newMsgSound';

// import { NoNessages } from '../components/Layout/Nodata';
import ChatSenderCard from '../components/Chats/ChatSenderCard';
import ChatListSearch from '../components/Chats/ChatListSearch';
import Banner from '../components/Notifications/Messages/Banner';
import MessageInputField from '../components/UI/MessageInputField';



const Messages = ({ chatsData = [], user }) => {

  const router = useRouter();

  const socket = useRef();
  const positionRef = useRef();
  //This ref is keeps the state of query string in url throughout re-renders It is the query setion in the url

  const openChatId = useRef('');

  const [chats, setChats] = useState(chatsData);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [bannerData, setBannerData] = useState({ name: '', profilePicUrl: '' });
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [switchTabs, setSwitchTabs] = useState(false);



  const scrollDivToBottom = positionRef => positionRef.current !== null && positionRef.current.scrollIntoView({ behaviour: 'smooth' });


  const setMessageToUnread = async () => {
    await axios.post(`${baseUrl}/chats`, {}, { headers: { Authorization: cookie.get("token") } });
  };


  //Connection
  useEffect(() => {

    if (user.unreadMessage) setMessageToUnread();
    if (!socket.current) { socket.current = io(pureBaseUrl) }


    if (socket.current) {
      socket.current.emit('join', { userId: user._id });

      socket.current.on('connectedUsers', ({ users }) => {
        users.length > 0 && setConnectedUsers(users);
      });
    }

    if (chats.length > 0 && !router.query.message) {
      router.push(`/messages?message=${chats[0].messagesWith}`, undefined, { shallow: true })
    }

  }, []);


  //Loading Msg
  useEffect(() => {

    const loadMessages = () => {
      socket.current.emit('loadMessages', {
        userId: user._id,
        messagesWith: router.query.message
      });

      socket.current.on('messagesLoaded', async ({ chat }) => {
        setMessages(chat.messages);
        setBannerData({
          name: chat.messagesWith.name,
          profilePicUrl: chat.messagesWith.profilePicUrl
        });

        openChatId.current = chat.messagesWith._id;
        positionRef.current && scrollDivToBottom(positionRef);
      })

      socket.current.on('noChatFound', async () => {

        const { name, profilePicUrl } = await getUserInfo(router.query.message);

        setBannerData({ name, profilePicUrl });
        setMessages([]);

        openChatId.current = router.query.message;
      });
    };
    if (socket.current && router.query.message) loadMessages();

  }, [router.query.message]);



  const sendMsg = msg => {
    if (socket.current) {
      socket.current.emit('sendNewMsg', {
        userId: user._id,
        msgSendToUserId: openChatId.current,
        msg
      })
    }
  }


  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    sendMsg(text);
    setText('');
    setLoading(false);
  }


  //Confirm sent & received msgs
  useEffect(() => {
    if (socket.current) {
      socket.current.on('msgSent', ({ newMsg }) => {
        if (newMsg.receiver === openChatId.current) {
          setMessages(prev => [...prev, newMsg]);

          setChats(prev => {
            const previousChat = prev.find(chat => chat.messagesWith === newMsg.receiver)
            previousChat.lastMessage = newMsg.msg
            previousChat.date = newMsg.date

            return [...prev];

          });
        }
      });



      socket.current.on('newMsgReceived', async ({ newMsg }) => {

        let senderName;

        //when chat is opened inside browser
        if (newMsg.sender === openChatId.current) {
          setMessages(prev => [...prev, newMsg]);

          setChats(prev => {
            const prevChat = prev.find(chat => chat.messagesWith === newMsg.sender);
            prevChat.lastMessage = newMsg.msg;
            prevChat.date = newMsg.date;
            senderName = prevChat.name;

            return [...prev]
          })
        } else {
          const ifPreviouslyMessaged = chats.filter(chat => chat.messagesWith === newMsg.sender).length > 0;

          if (ifPreviouslyMessaged) {
            setChats(prev => {
              const prevChat = prev.find(chat => chat.messagesWith === newMsg.sender);
              prevChat.lastMessage = newMsg.msg;
              prevChat.date = newMsg.date;
              senderName = prevChat.name;
              return [...prev]
            });

          } else {
            const { name, profilePicUrl } = await getUserInfo(newMsg.sender);

            senderName = name;

            const newChat = {
              messagesWith: newMsg.sender,
              name,
              profilePicUrl,
              lastMessage: newMsg.msg,
              date: newMsg.date
            };

            setChats(prev => [newChat, ...prev]);
          }
        }

        newMsgSound(senderName)
      });

    }
  }, []);


  useEffect(() => {
    messages.length > 0 && scrollDivToBottom(positionRef)
  }, [messages]);


  const deleteMsg = (messageId) => {
    if (socket.current) {
      socket.current.emit('deleteMsg', {
        userId: user._id,
        messagesWith: openChatId.current,
        messageId
      });
    }

    socket.current.on("msgDeleted", () => setMessages(prev => prev.filter(message => message._id !== messageId)));

  }



  const deleteChat = async messageswith => {

    try {
      const url = `${baseUrl}/chats/${messageswith}`;
      const header = { headers: { Authorization: cookie.get('token') } };

      await axios.delete(url, header);
      setChats(prev => prev.filter(chat => chat.messagesWith !== messageswith));
      router.push('/messages', undefined, { shallow: true });

    } catch (error) {
      console.log(error.message)
    }
  }


  const searchChatWindow = <>
    <Box sx={{
      maxWidth: '600px',
      minWidth: '20rem',
      height: '100%',
      overflow: "auto",
      mt: { xs: 1, sm: 1, ms: 2 }
    }} >

      <Tooltip title='Search or Create new Chat' arrow>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ flexGrow: 1 }} />
          <ChatListSearch chats={chats} setChats={setChats} />
        </Box>
      </Tooltip>

      {chats.length > 0 && <Box
        sx={{ width: '100%', maxHheight: '30rem', overflow: 'auto', my: 2 }} >
        {chats?.map((chat, i) => (
          <ChatSenderCard key={i}
            chat={chat}
            connectedUsers={connectedUsers}
            deleteChat={deleteChat} />
        ))}
      </Box>}
    </Box>
  </>


  const msgChatWindow = router.query.message && (
    <Paper
      sx={{
        m: { xs: 0, sm: 0, md: 2, lg: 3 },
        flexGrow: 1,
        overFlow: 'auto',
        height: '100%',
        display: 'grid',
        gridTemplateRows: '1fr 4fr 1fr',
      }}>
      <Box sx={{ display: 'flex', height: 'fit-content' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Banner bannerData={bannerData} />
        </Box>
        <IconButton variant='contained'
          sx={{
            height: '100%',
            my: 'auto',
            mr: 1,
            display: {
              xs: 'flex',
              sm: 'flex',
              md: 'none',
              lg: 'none',
              xl: 'none'
            }
          }}
          onClick={() => setSwitchTabs(prev => !prev)}>

          <SearchIcon fontSize='medium' />

        </IconButton>

      </Box>

      <Box sx={{
        overFlow: 'auto',
        overflowX: 'hidden',
      }}>
        {messages.length > 0 && (
          <>
            {messages.map((message, i) => (
              <Message
                positionRef={positionRef}
                key={i}
                bannerProfilePic={bannerData.profilePicUrl}
                message={message}
                user={user}
                deleteMsg={deleteMsg}
              />
            ))}
          </>
        )}
      </Box>

      <Box>
        <MessageInputField
          text={text}
          setText={setText}
          loading={loading}
          handleSubmit={handleSubmit}
        />
      </Box>
    </Paper>
  )


  return (
    <>
      <Box sx={{
        width: '100%',
        mt: 2,
        mx: 1,
        p: { md: 1, lg: 1 },
        height: '80vh'
      }}>

        {/* For mobile */}
        <Box
          sx={{
            display: {
              xs: 'flexbox',
              sm: 'flexbox',
              md: 'none',
              lg: 'none',
              xl: 'none'
            },
            width: {
              xs: '100%',
              sm: '100%',
            },
            height: '100%',
            mx: 'auto'
          }}>

          <Drawer
            anchor='left'
            open={switchTabs}
            onClose={() => setSwitchTabs(false)} >

            <Paper sx={{ pt: 6, pb: 2 }}>
              {searchChatWindow}
            </Paper>
          </Drawer>

          {msgChatWindow || searchChatWindow}{/* Need to see if it really works */}
        </Box>

        {/* For tab, laptop, pc */}
        <Box sx={{
          display: {
            xs: 'none',
            sm: 'none',
            md: 'flex',
            lg: 'flex',
            xl: 'flex'
          },

          flexWrap: 'wrap',
          width: {
            md: '100%',
            lg: '100%',
            xl: '100%'
          },
          height: '100%'
        }}>

          {searchChatWindow}
          {msgChatWindow}
        </Box>

      </Box>
    </>
  )
}

export default Messages;



export const getServerSideProps = async ctx => {
  try {
    const { token } = parseCookies(ctx);

    const url = `${baseUrl}/chats`;
    const header = { headers: { Authorization: token } };

    const res = await axios.get(url, header)

    if (res.data.status !== 'ok') throw new Error(res.data.message);

    return { props: { chatsData: res.data.data } };
  } catch (error) {
    return { props: { errorLoading: true } };
  }
};

