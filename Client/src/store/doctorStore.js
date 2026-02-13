import { getWithAuth } from "@/services/httpService";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useDoctorStore = create(
  persist((set, get) => ({
    doctors: [],
    currentDoctor: null,
    dashboard: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
    },
    clearError: () => set({ error: null }),
    setCurrentDoctor: (doctor) => set({
      currentDoctor: doctor
    }),


    fetchDoctors: async (filters = {}) => {
      set({ loading: true, error: null });
      try {
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([Key, value]) => {
          if (value !== null && value !== undefined && value !== "") {
            queryParams.append(Key, value.toString());
          }
        });
        const response = await getWithAuth(`doctor/list?${queryParams.toString()}`);
        set({
          doctors: response.data,
          pagination: {
            page: response.meta?.page || 1,
            limit: response?.limit || 20,
            total: response.meta?.total || 0,
          },
        })

      } catch (error) {
        set({ error: error.message });
      } finally {
        set({ loading: false });
      }
    },

    fetchDoctorById: async (id) => {
      set({ loading: true, error: null });
      try {
        const response = await getWithAuth(`/doctor/${id}`);
        set({ currentDoctor: response.data });
      } catch (error) {
        set({ error: error.message });
      } finally {
        set({ loading: false });
      }
    }



  }))
);

export default useDoctorStore;