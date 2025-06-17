import React, { useEffect, useState } from "react";
import { getAllCourses } from "@/lib/api/calls/course";
import { getDepartmentsWithCourses, assignCourseToDepartment, removeCourseFromDepartment } from "@/lib/api/calls/department";
import type { DepartmentWithCourses } from "@/lib/types/department";
import type { Course } from "@/lib/types/course";
import { Button } from "@/components/ui/button";

export function DepartmentCourseManager() {
  const [departments, setDepartments] = useState<DepartmentWithCourses[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getDepartmentsWithCourses(),
      getAllCourses()
    ]).then(([deptRes, courseRes]) => {
      if (deptRes.status && deptRes.data) setDepartments(deptRes.data);
      if (courseRes.status && courseRes.data) setCourses(courseRes.data);
      setLoading(false);
    });
  }, []);

  const handleAssign = async (departmentId: string, courseId: string) => {
    setActionLoading(`${departmentId}-${courseId}-assign`);
    await assignCourseToDepartment(departmentId, courseId);
    // Refresh departments
    const res = await getDepartmentsWithCourses();
    if (res.status && res.data) setDepartments(res.data);
    setActionLoading("");
  };

  const handleUnassign = async (departmentId: string, courseId: string) => {
    setActionLoading(`${departmentId}-${courseId}-unassign`);
    await removeCourseFromDepartment(departmentId, courseId);
    // Refresh departments
    const res = await getDepartmentsWithCourses();
    if (res.status && res.data) setDepartments(res.data);
    setActionLoading("");
  };

  return (
    <div className="mt-12">
      <h2 className="text-lg font-bold mb-4">Assign/Unassign Courses to Departments</h2>
      {loading ? <div>Loading...</div> : error ? <div className="text-red-500">{error}</div> : (
        <div className="space-y-8">
          {departments.map((dept) => (
            <div key={dept.id} className="bg-white dark:bg-gray-900 rounded-lg shadow p-4">
              <h3 className="font-semibold mb-2">{dept.name}</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800">
                      <th className="py-2 px-4 text-left">Course Title</th>
                      <th className="py-2 px-4 text-left">Course Code</th>
                      <th className="py-2 px-4 text-left">Level</th>
                      <th className="py-2 px-4 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => {
                      const assigned = dept.courses.some((c) => c.id === course.id);
                      return (
                        <tr key={course.id} className="border-b last:border-b-0 border-gray-200 dark:border-gray-700">
                          <td className="py-2 px-4">{course.course_title}</td>
                          <td className="py-2 px-4">{course.course_code}</td>
                          <td className="py-2 px-4">{course.level}</td>
                          <td className="py-2 px-4">
                            {assigned ? (
                              <Button size="sm" variant="destructive" disabled={actionLoading===`${dept.id}-${course.id}-unassign`} onClick={() => handleUnassign(dept.id, course.id)}>
                                {actionLoading===`${dept.id}-${course.id}-unassign` ? "Unassigning..." : "Unassign"}
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" disabled={actionLoading===`${dept.id}-${course.id}-assign`} onClick={() => handleAssign(dept.id, course.id)}>
                                {actionLoading===`${dept.id}-${course.id}-assign` ? "Assigning..." : "Assign"}
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

