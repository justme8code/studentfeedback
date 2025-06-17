import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { facultyFormSchema, FacultyFormData } from "@/lib/schema";
import { createFaculties } from "@/lib/api/calls/faculty";
import { useFacultyStore } from "@/lib/hooks/useFacultyStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Faculty } from "@/lib/types";
import { useLoadingStore } from "@/lib/hooks/use-loading-store";
import { useToast } from "@/lib/hooks/use-toast-store";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";

export function FacultyForm({ onFacultyAdded }: { onFacultyAdded?: () => void }) {
  const { addFaculty } = useFacultyStore();
  const { show, hide } = useLoadingStore();
  const { showSuccessToast, showErrorToast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FacultyFormData>({
    resolver: zodResolver(facultyFormSchema)
  });
  const [open, setOpen] = React.useState(false);

  const onSubmit = async (data: FacultyFormData) => {
    show("Creating faculty...");
    try {
      const {data:res,status,error} = await createFaculties([{ name: data.name } as Partial<Faculty>]);
      if (status && res && res.length > 0) {
        addFaculty(res[0]);
        showSuccessToast("Faculty created successfully!");
        reset();
        if (onFacultyAdded) onFacultyAdded();
      } else {
        showErrorToast(error?.message || "Failed to create faculty.");
      }
    } catch (error) {
      showErrorToast("An error occurred while creating faculty.");
    } finally {
      hide();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="mb-4 w-full" onClick={() => setOpen(true)}>
          Add Faculty
        </Button>
      </DialogTrigger>
      <DialogContent className="dark:bg-gray-900 dark:text-gray-100">
        <DialogHeader>
          <DialogTitle>Add Faculty</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(async (data) => {
          await onSubmit(data);
          setOpen(false);
        })} className="space-y-4">
          <div>
            <Input placeholder="Faculty Name" {...register("name")} />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>Add Faculty</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
