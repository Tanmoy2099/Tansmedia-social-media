import axios from "axios";
// import { useSelector } from 'react-redux';

import baseUrl from "./baseUrl";
import catchErrors from "./catchErrors";
import cookie from "js-cookie";
// import { userActions } from "../Store/user-slice";
import { signupActions } from "../Store/Signup-slice";

export const Axios = axios.create({
  baseURL: `${baseUrl}/user`,
  headers: { Authorization: cookie.get("token") }
});


export const registerUser = async (user, profilePicUrl, dispatch) => {
  const url = `${baseUrl}/user/signup`;

  const res = await axios.post(url, { ...user, profilePicUrl });

  //res will send user token, need to save it
  if (res.data.status === 'ok') {
    setToken(res.data.data)
    dispatch(signupActions.reset());
  }
  else { throw new Error(res.data.message) }
};


export const loginUser = async (user) => {

  const url = `${baseUrl}/user/login`;
  console.log(url);
  const res = await axios.post(url, user);

  if (res.data.status === 'ok') { setToken(res.data.data) }
  else { throw new Error(res.data.message) }
};



export const resetPassword = async (user, setMsg, setFormLoading) => {

  const url = `${baseUrl}/user/settings/forgotPassword`;
  setFormLoading(true);
  try {
    const res = await axios.post(url, user);

    if (res.data.status === 'ok') {
      return true;
    }
    else {
      setMsg({ hasMsg: true, type: 'error', message: (res.data.message) });
      return false;
    }

  } catch (error) {
    console.log(error.message);
  } finally {
    setFormLoading(false);

  }
};

export const submitPasswordResetToken = async (resetToken, data, setMsg) => {

  const url = `${baseUrl}/user/settings/resetPassword/${resetToken}`;

  try {
    const res = await axios.patch(url, data);

    if (res.data.status !== 'ok') {
      throw res.data.message
    }

    const token = res.data.data;

    setToken(token);

  } catch (error) {
    console.log(error.message)
    setMsg({ hasMsg: true, type: 'error', message: (error.response?.data?.message) });
  }
}


export const updatePassword = async (currentPassword, password, confirmPassword, setLoading, setMsg) => {

  const passwordConfirm = confirmPassword;
  try {
    const url = `/settings/updatePassword`;
    const body = { currentPassword, password, passwordConfirm };

    const res = await Axios.patch(url, body);

    if (res.data.status !== 'ok') {
      setMsg({ hasMsg: true, type: 'error', message: res.data.message });
      throw res.data.message
    }
    const token = res.data.data;
    setToken(token);
    setMsg({ hasMsg: true, type: 'success', message: 'Successfully updated!' });

  } catch (error) {
    setMsg({ hasMsg: true, type: 'error', message: error.message });
  } finally { setLoading(false) }
};



export const toggleMessagePopup = async (setPopupSetting, setMsg) => {
  try {
    const url = `/settings/messagePopup`;
    const res = await Axios.post(url);

    if (res.data.status !== 'ok') throw new Error(res.data.message)

    setPopupSetting(prev => !prev);
    setMsg({ hasMsg: true, type: 'success', message: 'Updated Successfully' });
    setTimeout(() => {
      setMsg({ hasMsg: false, type: '', message: '' });
    }, 10000);
  } catch (error) {
    catchErrors(error);
  }
};





export const redirectUser = (ctx, location) => {
  if (ctx.req) {
    ctx.res.writeHead(302, { Location: location });
    ctx.res.end();
  } else {
    window.location.href = location;
  }
};

const setToken = token => {
  cookie.set("token", token, { sameSite: 'none', secure: true });
  window.location.href = "/";
};

export const logoutUser = email => {
  cookie.set("userEmail", email);
  cookie.remove("token");
  window.location.href = "/login";
};
