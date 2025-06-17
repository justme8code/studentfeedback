import { create } from "zustand";
import type { Faculty } from "@/lib/types/faculty";

interface FacultyState {
  faculties: Faculty[];
  setFaculties: (faculties: Faculty[]) => void;
  addFaculty: (faculty: Faculty) => void;
  removeFaculty: (id: string) => void;
}

export const useFacultyStore = create<FacultyState>((set) => ({
  faculties: [],
  setFaculties: (faculties) => set({ faculties }),
  addFaculty: (faculty) => set((state) => ({ faculties: [...state.faculties, faculty] })),
  removeFaculty: (id) => set((state) => ({ faculties: state.faculties.filter(f => f.id !== id) })),
}));

