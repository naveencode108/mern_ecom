import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/Axios";


const initialState = {
    isAuth: false,
    isLoading: true,
    user: null
}

export const adminLogin = createAsyncThunk('/admin_login', async (data) => {
    const resp = await axios.post('/admin_login', data, { withCredentials: true });
    return resp.data;
});

export const authentication = createAsyncThunk('/check_auth', async () => {
    const resp = await axios.get('/check_auth',{withCredentials:true});
    return resp.data;
})

export const adminLogout=createAsyncThunk('/admin_logout',async()=>{
     const resp=await axios.get('/admin_logout',{withCredentials:true});
     return resp.data;
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => { },
    },
    extraReducers: (builder) => {
        builder.addCase(adminLogin.pending, (state) => {
            state.isLoading = true;
        }).addCase(adminLogin.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload;
            state.isAuth = action.payload.success?true:false;
        }).addCase(adminLogin.rejected, (state, action) => {
            state.isLoading = false;
            state.isAuth = false;
            state.user = null;
        }).addCase(authentication.pending, (state) => {
            state.isLoading = true;
        }).addCase(authentication.fulfilled, (state, action) => {
            state.isAuth = action.payload.success;
            state.isLoading = false;
            state.user = null;
        }).addCase(authentication.rejected, (state, action) => {
            state.isLoading = false;
            state.isAuth = false;
            state.user = null;
        }).addCase(adminLogout.pending,(state)=>{
            state.isLoading=true
        }).addCase(adminLogout.fulfilled,(state,action)=>{
            state.isAuth=false;
            state.isLoading=false;
            state.user=null;
        }).addCase(adminLogout.rejected,(state)=>{
            state.isLoading = false;
            state.isAuth = false;
            state.user = null;
        })
    }
})

export const { setUser } = authSlice.actions;
export default authSlice.reducer;

