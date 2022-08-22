import axios from "axios";
import baseUrl from "./baseUrl";
import catchErrors from "./catchErrors";
import cookie from "js-cookie";

export const Axios = axios.create({
  baseURL: `${baseUrl}/user`,
  headers: { Authorization: cookie.get("token") }
});


export const profileUpdate = async (data, setLoading, setMsg) => {

  try {

    const updated = await Axios.patch(`/update`, { ...data });

    if (updated.data.status !== 'ok') {
      setMsg({ hasMsg: 'true', mType: 'error', message: updated.data.message });
      throw updated.data.message
    }

    window.location.reload();
  } catch (error) {
    console.log(error.message)
    setMsg({ hasMsg: 'true', type: 'error', message: error.message });
  } finally { setLoading(false) }
};





