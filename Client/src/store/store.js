import { create } from "zustand";
import { persist } from "zustand/middleware"

export const userAuthStore = create(
  persist((set, get)=>{
    return {
      user:null,
      token:null,
      loading:false,
      error:null,
      isAuthenticated: false,

      setUser: (user, token)=>{
        set()
      }
    }
  })
)