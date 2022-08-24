import { createSlice } from "@reduxjs/toolkit";

import appName from "../utilsServer/appName";

const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
const regexEmailTest = new RegExp(/^[\w.! #$%&'*+/=? ^_`{|}~-]+@[\w].*[\w{2,3}]+$/);


const aboutFunc = () => `Hi there, I am using ${appName()}`

const initialState = {
  Name: {
    value: '',
    isValid: false,
  },
  UserName: {
    value: '',
    isValid: false
  },
  Email: {
    value: '',
    isValid: false,
  },
  Password: {
    value: '',
    isValid: false,
  },
  ConfirmPassword: {
    value: '',
    isValid: false
  },
  About: {
    value: aboutFunc()
  }
};



const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    
    name({ Name }, action) {

      const value = action.payload;
      Name.value = value;
      Name.isValid = value.length > 0;

    },

    userName({ UserName }, action) {
      const value = action.payload.trim();
      UserName.value = value;
      UserName.isValid = regexUserName.test(value);
    },

    email({ Email }, action) {
      
        const value = action.payload;
        Email.value = value.trim();
        Email.isValid = regexEmailTest.test(value);
      
    },

    password({ Password }, action) {
        const value = action.payload;
        Password.value = value.trim();
        Password.isValid = value.length > 7;
    },

    confirmPassword({ ConfirmPassword, Password }, action) {
        const value = action.payload;
        ConfirmPassword.value = value.trim();
        ConfirmPassword.isValid = ConfirmPassword.value === Password.value;
    },

    about({About}, action) {
      About.value = action.payload;
    },
    reset(state) {
      state = initialState;
    }
  }
});

export const signupActions = signupSlice.actions;

export default signupSlice.reducer;
