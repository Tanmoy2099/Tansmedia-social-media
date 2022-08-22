import axios from "axios";
import baseUrl from "./baseUrl";
import cookie from "js-cookie";

const getUserInfo = async userToFindId => {
  try {

    const url = `${baseUrl}/chats/user/${userToFindId}`;
    const header = { headers: { Authorization: cookie.get("token") } }
    
    const res = await axios.get(url, header);

    return { name: res.data.data.name, profilePicUrl: res.data.data.profilePicUrl };
  } catch (error) {
    console.error(error);
  }
};

export default getUserInfo;
