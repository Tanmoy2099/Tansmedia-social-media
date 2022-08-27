import axios from "axios";
import baseUrl from "./baseUrl";
import catchErrors from "./catchErrors";
import cookie from "js-cookie";

export const Axios = axios.create({
  baseURL: `${baseUrl}/profile`,
  headers: { Authorization: cookie.get("token") }
});

export const followUser = async (userToFollowId, setUserFollowStats) => {
  try {
    await Axios.post(`/follow/${userToFollowId}`);

    setUserFollowStats(prev => ({
      ...prev,
      following: [...prev.following, { user: userToFollowId }]
    }));
  } catch (error) {
    console.log(error.message);
  }
};

export const unfollowUser = async (userToUnfollowId, setUserFollowStats) => {
  try {
    await Axios.put(`/unfollow/${userToUnfollowId}`);

    setUserFollowStats(prev => ({
      ...prev,
      following: prev.following.filter(
        following => following.user !== userToUnfollowId
      )
    }));
  } catch (error) {
    console.log(error.message);
  }
};

