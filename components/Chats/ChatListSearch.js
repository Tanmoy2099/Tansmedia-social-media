import { useState, useEffect } from "react";
import axios from "axios";
import cookie from "js-cookie";
import { useRouter } from "next/router";
import baseUrl from "../../utils/baseUrl";
import Searchbar from "../UI/Searchbar";
import IncomingMsgArea from "./IncomingMsgArea";


// import { resourceLimits } from "worker_threads";
let cancel;

function ChatListSearch({ chats, setChats }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const router = useRouter();

  const handleChange = async value => {

    setText(value);

    if (value.length === 0) return;
    if (value.trim().length === 0) return;

    setLoading(true);

    try {
      cancel && cancel();
      const CancelToken = axios.CancelToken;
      const token = cookie.get("token");

      const res = await axios.get(`${baseUrl}/search/${value}`, {
        headers: { Authorization: token },
        cancelToken: new CancelToken(canceler => {
          cancel = canceler;
        })
      });

      if (res.data.data.length === 0) {
        results.length > 0 && setResults([]);

        return setLoading(false);
      }

      setResults(res.data.data);


    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const addChat = result => {

    const alreadyInChat = chats && chats?.filter(chat => chat?.messagesWith === result?._id).length > 0;

    if (alreadyInChat) {
      return router.push(`/messages?message=${result._id}`);

    } else {
      const newChat = {
        messagesWith: result._id,
        name: result.name,
        profilePicUrl: result.profilePicUrl,
        lastMessage: "",
        date: Date.now()
      };

      setChats(prev => [newChat, ...prev]);

      return router.push(`/messages?message=${result._id}`);
    }
  };


  useEffect(() => {
    if (text.length === 0 && loading) setLoading(false);
  }, [text]);

  return (
    <>


      {/* SEARCH BAR*/}
      <Searchbar
        onBlur={() => setTimeout(() => { setText('') }, [300])}
        placeholder="Find Chat"
        onClear={() => setText("")}
        value={text}
        onChange={e => handleChange(e.target.value)}
        onDropDown={text.length > 0 && <IncomingMsgArea data={results} onClick={addChat} />}
        loading={loading}
      />
    </>
  );
}



export default ChatListSearch;
