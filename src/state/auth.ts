import { create } from "zustand";

type Role = "creator" | "innovator" | "investor" | null;

type AuthState = {
  role: Role;
  setRole: (r: Role) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  role: (typeof window !== "undefined" ? (localStorage.getItem("userRole") as Role) : null) || null,
  setRole: (r) => {
    if (typeof window !== "undefined") {
      if (r) localStorage.setItem("userRole", r);
      else localStorage.removeItem("userRole");
    }
    set({ role: r });
  },
}));
