"use client";
import { FacultyList } from "@/components/admin/faculties/FacultyList";
import { FacultyForm } from "@/components/admin/faculties/FacultyForm";
import { useEffect, useState } from "react";
import { getFacultiesWithDepartments, deleteFaculty } from "@/lib/api/calls/faculty";
import type { Faculty } from "@/lib/types/faculty";
import type { Department } from "@/lib/types/department";
import { Button } from "@/components/ui/button";

export default function AdminFacultiesPage() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getFacultiesWithDepartments().then((res) => {
      if (res.status && res.data) setFaculties(res.data);
      else setError(res.error?.message || "Failed to fetch faculties");
      setLoading(false);
    });
  }, []);

  const handleDelete = async (facultyId: string) => {
    setLoading(true);
    setError("");
    const res = await deleteFaculty(facultyId);
    if (res.status) {
      setFaculties((prev) => prev.filter((f) => f.id !== facultyId));
    } else {
      setError(res.error?.message || "Failed to delete faculty");
    }
    setLoading(false);
  };

  return (
    <div className=" mx-auto max-w-7xl p-4">
      <div className={"flex justify-between items-center"}>
        <h2 className="text-xl font-bold mb-4">Faculties & Departments</h2>
        <div className={"max-w-44"}>
          <FacultyForm
            onFacultyAdded={() => {
              setLoading(true);
              getFacultiesWithDepartments().then((res) => {
                if (res.status && res.data) setFaculties(res.data);
                setLoading(false);
              });
            }}
          />
        </div>
      </div>
      <div>
        {/* <FacultyList /> removed delete from here */}
        <div className="mt-8">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="space-y-6">
              {faculties.map((faculty) => (
                <div key={faculty.id} className="bg-white dark:bg-gray-900 rounded-lg shadow p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{faculty.name}</h3>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(faculty.id)}>
                      Delete
                    </Button>
                  </div>
                  {faculty.departments && faculty.departments.length > 0 ? (
                    <ul className="list-disc pl-6">
                      {faculty.departments.map((dept: Department) => (
                        <li key={dept.id}>{dept.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400">No departments in this faculty.</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
