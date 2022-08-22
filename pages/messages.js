import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { parseCookies } from 'nookies';
import cookie from 'js-cookie';
import { useRouter } from 'next/router';
import {io} from 'socket.io-client';
import { Box, Container, Paper, Tooltip } from '@mui/material';

import getUserInfo from '../utils/getUserInfo';
import Message from '../components/Notifications/Messages/Message';
import baseUrl from '../utils/baseUrl';
import newMsgSound from '../utils/newMsgSound';

import { NoNessages } from '../components/Layout/Nodata';
import ChatSenderCard from '../components/Chats/ChatSenderCard';
import ChatListSearch from '../components/Chats/ChatListSearch';
import Banner from '../components/Notifications/Messages/Banner';
import MessageInputField from '../components/Notifications/Messages/MessageInputField';

const Messages = ({ chatsData, user }) => {
  const router = useRouter();
  const socket = useRef();

  const [chats, setChats] = useState(chatsData);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [bannerData, setBannerData] = useState({ name: '', profilePicUrl: '' });
  const [messages, setMessages] = useState([]);

  const positionRef = useRef();

  //This ref is keeps the state of query string in url throughout re-renders It is the query setion in the url
  const openChatId = useRef('');


  const scrollDivToBottom = positionRef => {
    positionRef.current !== null && positionRef.current.scrollIntoView({ behaviour: 'smooth' })
  };


  //Connection
  useEffect(() => {

    if (socket.current) {
      socket.current = io(baseUrl);
    }

    if (socket.current) {
      socket.current.emit('join', { userId: user._id });

      soc.current.on('connectedUsers', ({ users }) => {
        users.length > 0 && setConnectedUsers(users);



      });

    }
    if (chats.length > 0 && router.query.message) {
      router.push(`/message?message=${chats[0].messageWith}`, undefined, { shallow: true })
    }

    return () => {
      if (socket.current) {
        socket.current.emit('disconnect');
        socket.current.off();
      }
    }


  }, []);


  //Loading Msg
  useEffect(() => {

    const loadMessages = () => {
      socket.current.emit('loadMessages', { user: user._id, messageWith: router.query.message });

      socket.current.on('messagesLoaded', ({ chat }) => {
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
      socket.current.on('newMsgReceived', async newMsg => {

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
            const { name, profilePicUrl } = await getUserInfo(newMSg.sender);
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


  return (
    <>
      <Container sx={{
        width: { xs: '100%', sm: '100%', md: '90%', lg: '90%' }, p: { md: 1, lg: 1 },
        minHeight: '30rem',
        display: 'flex',
        flexWrap: 'wrap'
      }}>
        {/* ------------ chat user ----------------- */}

        <Box sx={{
          maxWidth: '20rem',
          height: '99%',
          minWidth: '20rem',
          mt: { xs: 1, sm: 1, ms: 2 },
          width: 'fit-content'
        }} >

          <Tooltip title='Search or Create new Chat' arrow>
            <Box sx={{ display: 'flex' }}>
              <Box sx={{ flexGrow: 1 }} />
              <ChatListSearch chats={chats} setChats={setChats} />
            </Box>
          </Tooltip>

          {chats.length > 0 && <Box
            sx={{ width: '100%', height: '100%', overflow: 'auto', mt: 2 }}>
            {chats?.map((chat, i) => (
              <ChatSenderCard key={i}
                chat={chat}
                connectedUsers={connectedUsers}
                deleteChat={deleteChat} />
            ))}
          </Box>}
        </Box>
        {/* --------------- chat window ------------------ */}
        {router.query.message && (
          <Paper sx={{
            m: { xs: 0, sm: 0, md: 2, lg: 3 },
            minWidth: { xs: '100%', sm: '100%', md: '37.5rem' },
            // position: 'relative',
            overFlow: 'auto',
            overflowX: 'hidden',
            maxHeight: '35rem',
            display: 'grid',
            gridTemplateRows: '1fr 4fr 1fr',
          }}>

            <Box >
              <Banner bannerData={bannerData} />
            </Box>


            <Box>
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
            <Box >
              <MessageInputField sendMsg={sendMsg} />
            </Box>


          </Paper>
        )}



      </Container>
    </>
  )
}

export default Messages;



Messages.getInitialProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);

    const url = `${baseUrl}/chats`;
    const header = { headers: { Authorization: token } };

    const res = await axios.get(url, header)
    if (res.data.status !== 'ok') throw res.data.message;

    return { chatsData: res.data.data };

  } catch (error) {
    return { errorLoading: true };
  }
}