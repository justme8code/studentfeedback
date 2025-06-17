'use client';
import { DepartmentList } from "@/components/admin/departments/DepartmentList";
import { DepartmentForm } from "@/components/admin/departments/DepartmentForm";
import { DepartmentCourseManager } from "@/components/admin/departments/DepartmentCourseManager";
import { useState } from "react";

export default function AdminDepartmentsPage() {
  const [departmentsRefreshKey, setDepartmentsRefreshKey] = useState(0);

  return (
      <div className={"max-w-7xl p-4  mx-auto space-y-10"}>
         <div className={"flex justify-between"}>
             <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                 Department Management
             </h2>

             <DepartmentForm onDepartmentAdded={() => setDepartmentsRefreshKey(k => k + 1)} />
         </div>
          <div className="grid-cols-2 md:grid-cols-2 gap-10 ">
                  <DepartmentList key={departmentsRefreshKey} />
                  <div className="col-span-1 md:col-span-2">
                      <DepartmentCourseManager key={departmentsRefreshKey} />
                  </div>
          </div>
      </div>

  );
}
