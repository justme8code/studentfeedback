'use client';

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { lecturerFormSchema } from "@/lib/schema";
import { createLecturer } from "@/lib/api/calls/lecturer";
import { getFacultiesWithDepartments } from "@/lib/api/calls/faculty";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoadingStore } from "@/lib/hooks/use-loading-store";
import { useToast } from "@/lib/hooks/use-toast-store";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Faculty, Department } from "@/lib/types";

export function LecturerForm() {
  const { show, hide } = useLoadingStore();
  const { showSuccessToast, showErrorToast } = useToast();
  const [open, setOpen] = useState(false);

  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const form = useForm<z.infer<typeof lecturerFormSchema>>({
    resolver: zodResolver(lecturerFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      facultyId: "",
      departmentId: "",
    },
  });

  const { watch, resetField } = form;
  const watchedFacultyId = watch("facultyId");

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const { data } = await getFacultiesWithDepartments();
        if (data) setFaculties(data);
      } catch (error) {
        console.error("Error fetching faculties:", error);
        showErrorToast("Failed to load faculties.");
      }
    };
    fetchFaculties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (watchedFacultyId) {
      const selectedFaculty = faculties.find(f => String(f.id) === watchedFacultyId);
      setDepartments(selectedFaculty?.departments || []);
    } else {
      setDepartments([]);
    }
  }, [watchedFacultyId, faculties]);


  const onSubmit = async (values: z.infer<typeof lecturerFormSchema>) => {
    show("Creating lecturer...");
    try {
      const payload = {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        faculty_id: Number(values.facultyId),
        department_id: Number(values.departmentId),
      };

      const { data, status, message } = await createLecturer(payload);

      if (data && status) {
        showSuccessToast("Lecturer created successfully!");
        form.reset();
        setOpen(false);
      } else {
        showErrorToast(message || "Failed to create lecturer.");
      }
    } catch (error) {
      console.error("Error creating lecturer:", error);
      showErrorToast("An error occurred while creating lecturer.");
    } finally {
      hide();
    }
  };

  return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default" className="mb-4 w-full">
            Add Lecturer
          </Button>
        </DialogTrigger>
        <DialogContent className="dark:bg-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle>Add New Lecturer</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Input fields */}
              <FormField control={form.control} name="fullName" render={({ field }) => ( <FormItem><FormControl><Input placeholder="Full Name" {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormControl><Input placeholder="Email" type="email" {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="password" render={({ field }) => ( <FormItem><FormControl><Input placeholder="Password" type="password" {...field} /></FormControl><FormMessage /></FormItem> )} />
              <FormField control={form.control} name="confirmPassword" render={({ field }) => ( <FormItem><FormControl><Input placeholder="Confirm Password" type="password" {...field} /></FormControl><FormMessage /></FormItem> )} />

              {/* Faculty Select */}
              <FormField
                  control={form.control}
                  name="facultyId"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Faculty</FormLabel>
                        <Select
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                              resetField("departmentId");
                            }}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a faculty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {faculties?.map((faculty) => (
                                <SelectItem key={faculty.id} value={String(faculty.id)}>
                                  {faculty.name}
                                </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                  )}
              />

              {/* Department Select */}
              <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>Department</FormLabel>
                        <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={!watchedFacultyId || departments.length === 0}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a department" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {departments?.map((dept) => (
                                <SelectItem key={dept.id} value={String(dept.id)}>
                                  {dept.name}
                                </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                  )}
              />

              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                <Button type="submit" disabled={form.formState.isSubmitting}>Create Lecturer</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
  );
}