import { getWithAuth, postWithAuth, postWithoutAuth, putWithAuth } from "@/service/httpService";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const userAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      isAuthenticated: false,

      // Set user & token
      setUser: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
          error: null,
        });
        localStorage.setItem("token", token);
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Logout
      logout: () => {
        localStorage.removeItem("token");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // Doctor login
      loginDoctor: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await postWithoutAuth("/auth/doctor/login", {
            email,
            password,
          });
          get().setUser(response.data.user, response.data.token);
        } catch (error) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      // Patient login
      loginPatient: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await postWithoutAuth("/auth/patient/login", {
            email,
            password,
          });
          get().setUser(response.data.user, response.data.token);
        } catch (error) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      // Doctor register
      registerDoctor: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await postWithoutAuth("/auth/doctor/register", data);
          get().setUser(response.data.user, response.data.token);
        } catch (error) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      // Patient register
      registerPatient: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await postWithoutAuth("/auth/patient/register", data);
          get().setUser(response.data.user, response.data.token);
        } catch (error) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      // Fetch profile
      fetchProfile: async () => {
        set({ loading: true, error: null });
        try {
          const user = get().user;
          if (!user) throw new Error("No user found");

          const endPoint = user.type === "doctor" ? "/doctor/me" : "/patient/me";

          const response = await getWithAuth(endPoint);

          set({ user: { ...user, ...response.data } });

          return response.data;
        } catch (error) {
          set({ error: error.message });
          return null;
        } finally {
          set({ loading: false });
        }
      },

      // Update profile
      updateProfile: async (data) => {
        set({ loading: true, error: null });
        try {
          const user = get().user;
          if (!user) throw new Error("No user found");

          const endPoint =
            user.type === "doctor"
              ? "/doctor/onboarding/update"
              : "/patient/onboarding/update";

          const response = await putWithAuth(endPoint, data);

          set({ user: { ...user, ...response.data } });
        } catch (error) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
