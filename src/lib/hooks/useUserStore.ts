import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/types/user";

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-store",
    }
  )
);

// Role helpers
export function getUserRole(user: User | null): "admin" | "lecturer" | "student" | null {
  if (!user) return null;
  if (user.role_id === 1) return "admin";
  if (user.role_id === 2) return "lecturer";
  if (user.role_id === 3) return "student";
  return null;
}

export function isAdmin(user: User | null) {
  return getUserRole(user) === "admin";
}
export function isLecturer(user: User | null) {
  return getUserRole(user) === "lecturer";
}
export function isStudent(user: User | null) {
  return getUserRole(user) === "student";
}

