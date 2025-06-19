"use client";

import { useEffect, useState, useRef } from "react";
import { getDepartmentsWithCourses } from "@/lib/api/calls/department";
import { createCourse } from "@/lib/api/calls/course";
import type { DepartmentWithCourses } from "@/lib/types/department";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";

export default function CoursesPage() {
  const [departments, setDepartments] = useState<DepartmentWithCourses[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [addForm, setAddForm] = useState({ course_title: "", course_code: "", level: ""});
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const addFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setLoading(true);
    getDepartmentsWithCourses().then((res) => {
      if (res.status && res.data) setDepartments(res.data);
      else setError(res.error?.message || "Failed to fetch departments and courses");
      setLoading(false);
    });
  }, []);


  const filteredDepartments = departments.map((dept) => {
    let filteredCourses = dept.courses || [];
    if (search) {
      const s = search.toLowerCase();
      filteredCourses = filteredCourses.filter(
        (c) =>
          c.course_title.toLowerCase().includes(s) ||
          c.course_code.toLowerCase().includes(s)
      );
    }
    if (levelFilter) {
      filteredCourses = filteredCourses.filter((c) => String(c.level) === levelFilter);
    }
    return { ...dept, courses: filteredCourses };
  });

  // Get all unique levels for filter dropdown
  const allLevels = Array.from(
    new Set(
      departments.flatMap((d) => (d.courses || []).map((c) => c.level))
    )
  ).sort();

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError("");
    setAddSuccess("");
    // The createCourse API may need to be updated to accept arguments. For now, we assume it does.
    const res = await createCourse({
      ...addForm,
      level: addForm.level
    });
    if (res.status) {
      setAddSuccess("Course added successfully!");
      setAddForm({ course_title: "", course_code: "", level: "" });
      if (addFormRef.current) addFormRef.current.reset();
      setLoading(true);
      getDepartmentsWithCourses().then((res) => {
        if (res.status && res.data) setDepartments(res.data);
        setLoading(false);
      });
    } else {
      setAddError(res.error?.message || "Failed to add course");
    }
    setAddLoading(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className={"flex justify-between items-center "}>
        <h1 className="text-2xl font-bold mb-6">Department Courses</h1>
      </div>


      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 ite">
        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <input
              type="text"
              placeholder="Search by course title or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-md px-4 py-2 w-full sm:w-80 dark:bg-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="border rounded-md px-4 py-2 w-full sm:w-40 dark:bg-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Levels</option>
            {allLevels.map((level) => (
                <option key={level as string} value={level as string}>
                  {level}
                </option>
            ))}
          </select>
        </div>

        {/* Add Course Button & Dialog */}
        <div className="flex justify-end">
          <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setAddModalOpen(true)} variant="default">
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Course</DialogTitle>
              </DialogHeader>
              <form ref={addFormRef} onSubmit={handleAddCourse} className="space-y-4">
                <Input
                    placeholder="Course Title"
                    value={addForm.course_title}
                    onChange={(e) => setAddForm((f) => ({ ...f, course_title: e.target.value }))}
                    required
                />
                <Input
                    placeholder="Course Code"
                    value={addForm.course_code}
                    onChange={(e) => setAddForm((f) => ({ ...f, course_code: e.target.value }))}
                    required
                />
                <Input
                    placeholder="Level"
                    value={addForm.level}
                    onChange={(e) => setAddForm((f) => ({ ...f, level: e.target.value }))}
                    required
                />

                {addError && <div className="text-red-500">{addError}</div>}
                {addSuccess && <div className="text-green-600">{addSuccess}</div>}

                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={addLoading}>
                    {addLoading ? "Adding..." : "Add Course"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : !departments || departments.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400 text-center">No departments or courses found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((dept) => (
            <div key={dept.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-md ring-gray-500 p-6 flex flex-col h-full">
              <h2 className="text-lg font-semibold mb-3 text-primary">{dept.name}</h2>
              {!dept.courses || dept.courses.length === 0 ? (
                <div className="text-gray-500 dark:text-gray-400 flex-1 flex items-center justify-center">No courses in this department.</div>
              ) : (
                <ul className="flex-1 space-y-2">
                  {dept.courses.map((course) => (
                    <li key={course.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
                      <div className="font-medium text-base">{course.course_title}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 flex justify-between mt-1">
                        <span>{course.course_code}</span>
                        <span>Level {course.level}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
