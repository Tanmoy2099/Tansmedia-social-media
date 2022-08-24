import axios from "axios";
import baseUrl from "./baseUrl";
import catchErrors from "./catchErrors";
import cookie from "js-cookie";

export const Axios = axios.create({
  baseURL: `${baseUrl}/posts`,
  headers: { Authorization: cookie.get("token") }
});

export const submitNewPost = async (
  user,
  text,
  location,
  picUrl,
  setPosts,
  setNewPost,
  setError
) => {
  try {
    const res = await Axios.post("/", { text, location, picUrl });

    const newPost = {
      ...res.data.data,
      user,
      likes: [],
      comments: []
    };

    setPosts(prev => [newPost, ...prev]);
    setNewPost({ text: "", location: "" });
  } catch (error) {
    const errorMsg = catchErrors(error);
    setError(errorMsg);
  }
};

export const deletePost = async (postId, setPosts, setShowToastr, setMsg) => {
  try {
    const res = await Axios.delete(`/${postId}`);

    if (res.data.status !== 'ok') {
      setMsg({ hasMag: true, type: 'error', message: res.data.message });
    }

    setPosts(prev => prev.filter(post => post._id !== postId));
    setShowToastr(true);
  } catch (error) {
    (catchErrors(error));
  }
};

export const likePost = async (postId, userId, setLikes, setMsg, like = true) => {

  try {
    if (like) {
      const res = await Axios.post(`/like/${postId}`);

      if (res.data.status !== 'ok') {
        setMsg({ hasMag: true, type: 'error', message: res.data.message });
      }

      setLikes(prev => [...prev, { user: userId }]);

    } else if (!like) {
      const res = await Axios.put(`/unlike/${postId}`);

      if (res.data.status !== 'ok') {
        setMsg({ hasMag: true, type: 'error', message: res.data.message });
        return;
      }
      setLikes(prev => prev.filter(like => like.user !== userId));
    }

  } catch (error) {
    (catchErrors(error));
  }
};

export const postComment = async (postId, user, text, setComments, setText, setMsg) => {
  try {
    const res = await Axios.post(`/comment/${postId}`, { text });

    if (res.data.status !== 'ok') {
      setMsg({ hasMag: true, type: 'error', message: res.data.message });
      return;
    }

    const newComment = {
      _id: res.data.data,
      user,
      text,
      // date: Date.now()
    };

    setComments(prev => [newComment, ...prev]);
    setText("");
  } catch (error) {
    (catchErrors(error));
  }
};

export const deleteComment = async (postId, commentId, setComments, setMsg) => {
  try {
    const res = await Axios.delete(`/${postId}/${commentId}`);

    if (res.data.status !== 'ok') {
      setMsg({ hasMag: true, type: 'error', message: res.data.message });
      return;
    }

    setComments(prev => prev.filter(comment => comment._id !== commentId));
  } catch (error) {
    // (catchErrors(error));
    console.log(error);
  }
};
