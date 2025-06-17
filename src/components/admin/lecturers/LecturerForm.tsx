import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpFormSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoadingStore } from "@/lib/hooks/use-loading-store";
import { useToast } from "@/lib/hooks/use-toast-store";
import * as z from "zod";
import { createLecturer } from "@/lib/api/calls/lecturer";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export function LecturerForm() {
  const { show, hide } = useLoadingStore();
  const { showSuccessToast, showErrorToast } = useToast();
  const form = useForm({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [open, setOpen] = React.useState(false);

  const onSubmit = async (values: z.infer<typeof signUpFormSchema>) => {
    show("Creating lecturer...");
    try {
      const { data, status, message } = await createLecturer({ ...values });
      if (data && status) {
        showSuccessToast("Lecturer created successfully!");
        form.reset();
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
        <Button
          variant="default"
          className="mb-4 w-full"
          onClick={() => setOpen(true)}
        >
          Add Lecturer
        </Button>
      </DialogTrigger>
      <DialogContent className="dark:bg-gray-900 dark:text-gray-100">
        <DialogHeader>
          <DialogTitle>Add New Lecturer</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(async (values) => {
            await onSubmit(values);
            setOpen(false);
          })}
          className="space-y-4 max-w-md mx-auto"
        >
          <Input placeholder="Full Name" {...form.register("fullName")} />
          {form.formState.errors.fullName && (
            <p className="text-red-500 text-xs">
              {form.formState.errors.fullName.message as string}
            </p>
          )}
          <Input placeholder="Email" type="email" {...form.register("email")} />
          {form.formState.errors.email && (
            <p className="text-red-500 text-xs">
              {form.formState.errors.email.message as string}
            </p>
          )}
          <Input
            placeholder="Password"
            type="password"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-red-500 text-xs">
              {form.formState.errors.password.message as string}
            </p>
          )}
          <Input
            placeholder="Confirm Password"
            type="password"
            {...form.register("confirmPassword")}
          />
          {form.formState.errors.confirmPassword && (
            <p className="text-red-500 text-xs">
              {form.formState.errors.confirmPassword.message as string}
            </p>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              Create Lecturer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
