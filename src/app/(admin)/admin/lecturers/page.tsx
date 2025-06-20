'use client';
import { LecturerList } from "@/components/admin/lecturers/LecturerList";
import {LecturerForm} from "@/components/admin/lecturers/LecturerForm";
import {User} from "lucide-react";
import React from "react";

export default function AdminLecturersPage() {
  return (
    <div className="w-full max-w-7xl mx-auto">
         <div className={"flex justify-between"}>
             <h2 className="font-bold mb-4  text-2xl flex items-center gap-2">
                 <User className="w-6 h-6" /> Lecturers
             </h2>
             <div className={"max-w-44"}>
                 <LecturerForm />
             </div>
         </div>
      <div className="w-full ">
        <LecturerList />
      </div>

    </div>
  );
}
