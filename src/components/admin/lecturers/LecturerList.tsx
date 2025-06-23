import React, { useEffect, useState } from "react";
import { fetchAllLecturers, deleteLecturer, updateLecturer } from "@/lib/api/calls/lecturer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/hooks/use-toast-store";
import { ConfirmDeleteModal } from "@/components/modals/confirm-delete-modal";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2 } from "lucide-react";
import type { User as UserType } from "@/lib/types/user";
import { LecturerCourseOfferingsManager } from "@/components/admin/lecturers/LecturerCourseOfferingsManager";
import {LecturerProfile, StudentProfile} from "@/lib/types";

export function LecturerList() {
  const [lecturers, setLecturers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editLecturer, setEditLecturer] = useState<UserType | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: "", email: "" });
  const [offeringsLecturer, setOfferingsLecturer] = useState<UserType | null>(null);
  const [offeringsModalOpen, setOfferingsModalOpen] = useState(false);
  const { showSuccessToast, showErrorToast } = useToast();

  useEffect(() => {
    setLoading(true);
    fetchAllLecturers().then((res) => {
      if (res.status === 200 && res.data) setLecturers(res.data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    const res = await deleteLecturer(deleteId);
    if (res.status === 200) {
      setLecturers((prev) => prev.filter((l) => l.id !.toString()== deleteId));
      showSuccessToast("Lecturer deleted successfully!");
    } else {
      showErrorToast(res.error?.message || "Failed to delete lecturer.");
    }
    setDeleteId(null);
    setModalOpen(false);
  };

  const openEditModal = (lecturer: UserType) => {
    setEditLecturer(lecturer);
    setEditForm({ full_name: lecturer.full_name, email: lecturer.email });
    setEditModalOpen(true);
  };

  const handleEdit = async () => {
    if (!editLecturer) return;
    if (!window.confirm("Are you sure you want to save these changes?")) return;
    const res = await updateLecturer(editLecturer.id!.toString(), editForm);
    if (res.status === 200 && res.data) {
      setLecturers((prev) => prev.map((l) => l.id === editLecturer.id ? { ...l, ...editForm } : l));
      showSuccessToast("Lecturer updated successfully!");
      setEditModalOpen(false);
    } else {
      showErrorToast(res.error?.message || "Failed to update lecturer.");
    }
  };

  function isLecturerProfile(profile: StudentProfile | LecturerProfile | null): profile is LecturerProfile {
    return profile !== null && 'department' in profile;
  }

  return (
    <div className="">

      {loading ? <div>Loading...</div> : (
        <div className="overflow-x-auto">
          {lecturers.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">No lecturers found.</div>
          ) : (
            <table className="min-w-full bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="py-3 px-4 text-left">Id</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Faculty</th>
                  <th className="py-3 px-4 text-left">Department</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lecturers&& lecturers.length>0 && lecturers.map((lecturer) => (
                  <tr key={lecturer.id} className="border-b last:border-b-0 border-gray-200 dark:border-gray-700">
                    <td className="py-2 px-4">{lecturer.id}</td>
                    <td className="py-2 px-4">{lecturer.full_name}</td>
                    <td className="py-2 px-4">{lecturer.email}</td>

                    {
                        isLecturerProfile(lecturer.profile) && (
                            <td className="py-2 px-4">{lecturer.profile.department.faculty?.name}</td>
                        )
                    }
                    {
                      isLecturerProfile(lecturer.profile) && (
                            <td className="py-2 px-4">{lecturer.profile.department.name}</td>
                        )
                    }


                    <td className="py-2 px-4 flex gap-10 items-center">
                      <Button size={"sm"} variant="outline" onClick={() => openEditModal(lecturer)} title="Edit">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button  size={"sm"} variant="destructive" onClick={() => { setDeleteId(lecturer.id!.toString()); setModalOpen(true); }} title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Dialog open={offeringsModalOpen && offeringsLecturer?.id === lecturer.id} onOpenChange={open => { setOfferingsModalOpen(open); if (!open) setOfferingsLecturer(null); }}>
                        <DialogTrigger asChild>
                          <Button size="default" variant="outline" onClick={() => { setOfferingsLecturer(lecturer); setOfferingsModalOpen(true); }}>
                            Assigned Courses
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="dark:bg-gray-900 dark:text-gray-100 max-w-2xl">
                          {offeringsLecturer && <LecturerCourseOfferingsManager lecturer={offeringsLecturer} onClose={() => setOfferingsModalOpen(false)}
                          />}

                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      <ConfirmDeleteModal
        open={modalOpen}
        title="Delete Lecturer?"
        description="Are you sure you want to delete this lecturer? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => { setModalOpen(false); setDeleteId(null); }}
        confirmText="Delete"
        cancelText="Cancel"
      />
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">Edit Lecturer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Full Name"
              value={editForm.full_name}
              onChange={e => setEditForm(f => ({ ...f, full_name: e.target.value }))}
              className="dark:bg-gray-800 dark:text-gray-100"
            />
            <Input
              placeholder="Email"
              value={editForm.email}
              onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
              className="dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
