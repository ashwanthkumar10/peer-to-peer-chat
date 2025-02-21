import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";

import toast from "react-hot-toast";

import { io } from "socket.io-client";


const BASE_URL = import.meta.env.MODE === "development" ?"http://localhost:5000" :"/";
export const useAuthStore = create((set , get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers:[],
  socket:null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data }); // Correct usage of Zustand's set function
      get().connectSocket()

    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null }); // Handle error by resetting authUser
    } finally {
      set({ isCheckingAuth: false }); // Ensure isCheckingAuth is false after the process
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });  // ✅ Start loading state before request
    try {
        const res = await axiosInstance.post("/auth/signup", data);
        set({ authUser: res.data });
        toast.success("Account Created Successfully");
        get().connectSocket();
    } catch (error) {
        toast.error(error.response?.data?.message || "Signup failed!");
    } finally {
        set({ isSigningUp: false }); // ✅ Reset loading state after request
    }
}

,
login:async(data)=>{
  set({isLoggingIn:true});
  try {
    const res = await axiosInstance.post("/auth/login" , data)
    set({authUser:res.data})
    toast.success("Logged in successfully")
    get().connectSocket();

  } catch (error) {
    toast.error(error.response.data.message)
    set({isLoggingIn:false})
  }

}
,
    logout: async()=>
    {
   try {
    
    await axiosInstance.post("/auth/logout");
    set({authUser:null})
    toast.success("Logged out sucessfully")
    get().disconnectSocket()
   } catch (error) {
    toast.error(error.response.data.message)
   }
    }
    ,
    updateProfile : async(data)=>{
      set({isUpdatingProfile: true})
      try {
        
       const res = await axiosInstance.put("/auth/update-profile" , data);
        set({authUser:res.data})
        toast.success("Profile uploaded sucessfully")
       } catch (error) {
        console.log("error in uploading profile" , error);
        
        toast.error(error.response.data.message)
       }
       finally{
        set({isUpdatingProfile:false})
       }
        
    },
    connectSocket:()=>{
      const {authUser} =  get()
      if(!authUser || get().socket?.connected) return ;
      const socket = io(BASE_URL , {
        query:{
          userId:authUser._id, 
        }, 
      })

      socket.connect();

      set({socket:socket})

      socket.on("getOnlineUsers" , (userIds)=>{
        set({onlineUsers:userIds})
      })
    },
    disconnectSocket:()=>{
      if(get().socket?.connected) get().socket.disconnect(); 
    },
}));
