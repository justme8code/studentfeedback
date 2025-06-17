'use client';
import { LecturerList } from "@/components/admin/lecturers/LecturerList";
import {LecturerForm} from "@/components/admin/lecturers/LecturerForm";

export default function AdminLecturersPage() {
  return (
    <div className="w-full max-w-7xl mx-auto">
         <div className={"flex justify-end"}>
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
