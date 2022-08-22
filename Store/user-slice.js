import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  data: {
    id: "",
    name: "",
    username: "",
    email: "",
    profilePicUrl: "",
    about:'',
    role:'',
  },
  followersStats: {}
}
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      const user = action.payload.user;
      const followersStats = action.payload.followersStats;

      state.isLoggedIn = true;
      state.data.id = user._id;
      state.data.name = user.name;
      state.data.username = user.username;
      state.data.email = user.email;
      state.data.about = user.about;
      state.data.role = user.role;
      state.data.profilePicUrl = user.profilePicUrl;
      state.followersStats = followersStats;
    },
    resetUser(state) {
      state.isLoggedIn = false;
      state.data.id = "";
      state.data.name = "";
      state.data.username = "";
      state.data.email = "";
      state.data.about = "";
      state.data.role = "";
      state.data.profilePicUrl = "";
      state.followersStats = {};
    }
  }
});

export const userActions = userSlice.actions;
export default userSlice.reducer;