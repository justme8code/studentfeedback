import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { departmentFormSchema, DepartmentFormData } from "@/lib/schema";
import { createDepartments } from "@/lib/api/calls/department";
import { useDepartmentStore } from "@/lib/hooks/useDepartmentStore";
import { useFacultyStore } from "@/lib/hooks/useFacultyStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Department } from "@/lib/types/department";
import { useLoadingStore } from "@/lib/hooks/use-loading-store";
import { useToast } from "@/lib/hooks/use-toast-store";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";

export function DepartmentForm({ onDepartmentAdded }: { onDepartmentAdded?: () => void }) {
  const { addDepartment } = useDepartmentStore();
  const { faculties } = useFacultyStore();
  const { show, hide } = useLoadingStore();
  const { showSuccessToast, showErrorToast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentFormSchema)
  });
  const [open, setOpen] = React.useState(false);

  const onSubmit = async (data: DepartmentFormData) => {
    show("Creating department...");
    try {
      const res = await createDepartments([{ name: data.name, faculty_id: data.faculty_id } as Partial<Department>]);
      if (res.status && res.data && res.data.length > 0) {
        addDepartment(res.data[0]);
        showSuccessToast("Department created successfully!");
        reset();
        if (onDepartmentAdded) onDepartmentAdded();
      } else {
        showErrorToast(res.error?.message || "Failed to create department.");
      }
    } catch (error) {
      showErrorToast("An error occurred while creating department.");
    } finally {
      hide();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="mb-4" onClick={() => setOpen(true)}>
          Add Department
        </Button>
      </DialogTrigger>
      <DialogContent className="dark:bg-gray-900 dark:text-gray-100">
        <DialogHeader>
          <DialogTitle>Add Department</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(async (data) => {
          await onSubmit(data);
          setOpen(false);
        })} className="space-y-4">
          <div>
            <Input placeholder="Department Name" {...register("name")}/>
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>
          <div>
            <select {...register("faculty_id")} className="w-full border rounded p-2 dark:bg-gray-900 dark:text-gray-100">
              <option value="">Select Faculty</option>
              {faculties.map(faculty => (
                <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
              ))}
            </select>
            {errors.faculty_id && <p className="text-red-500 text-xs">{errors.faculty_id.message}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>Add Department</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
