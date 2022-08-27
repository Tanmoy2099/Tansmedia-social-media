import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    socket: null
}

const socketSlice = createSlice({
    name: "socketRedux",
    initialState,
    reducers: {
        setSocket(state, action) {
            state.socket = action.payload;
        }
    }
})


export const socketActions = socketSlice.actions;

export default socketSlice.reducer;