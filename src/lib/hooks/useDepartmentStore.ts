import { create } from "zustand";
import type { Department } from "@/lib/types/department";

interface DepartmentState {
  departments: Department[];
  setDepartments: (departments: Department[]) => void;
  addDepartment: (department: Department) => void;
  removeDepartment: (id: string) => void;
}

export const useDepartmentStore = create<DepartmentState>((set) => ({
  departments: [],
  setDepartments: (departments) => set({ departments }),
  addDepartment: (department) => set((state) => ({ departments: [...state.departments, department] })),
  removeDepartment: (id) => set((state) => ({ departments: state.departments.filter(d => d.id !== id) })),
}));

