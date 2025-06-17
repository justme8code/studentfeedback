import React, { useEffect, useState } from "react";
import { useFacultyStore } from "@/lib/hooks/useFacultyStore";
import { fetchAllFaculties, deleteFaculty } from "@/lib/api/calls/faculty";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/hooks/use-toast-store";
import { Trash2, Pencil, School } from "lucide-react";
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal";

export function FacultyList({ onEdit }: { onEdit?: (id: string) => void }) {
  const { faculties, setFaculties, removeFaculty } = useFacultyStore();
  const { showSuccessToast, showErrorToast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchAllFaculties().then((res) => {
      if (res.status && res.data) setFaculties(res.data);
    });
  }, [setFaculties]);

  const handleDelete = async () => {
    if (!deleteId) return;
    const res = await deleteFaculty(deleteId);
    if (res.status) {
      removeFaculty(deleteId);
      showSuccessToast("Faculty deleted successfully!");
    } else {
      showErrorToast(res.error?.message || "Failed to delete faculty.");
    }
    setDeleteId(null);
    setModalOpen(false);
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <School className="w-6 h-6 text-primary" /> Faculties
      </h2>
      <ul className="space-y-3">
        {faculties.map((faculty) => (
          <li key={faculty.id} className="flex items-center justify-between border p-4 rounded-lg shadow-sm   hover:shadow-md transition">
            <span className="flex items-center gap-2 font-medium text-base">
              <School className="w-5 h-5 text-blue-500" /> {faculty.name}
            </span>
            <div className="space-x-2 flex">
              {onEdit && (
                <Button size="icon" variant="outline" onClick={() => onEdit(faculty.id)} title="Edit">
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
              <Button size="icon" variant="destructive" onClick={() => { setDeleteId(faculty.id); setModalOpen(true); }} title="Delete">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <ConfirmDeleteModal
        open={modalOpen}
        title="Delete Faculty?"
        description="If this faculty is deleted, all departments under this faculty might get deleted. Are you sure you want to proceed?"
        onConfirm={handleDelete}
        onCancel={() => { setModalOpen(false); setDeleteId(null); }}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
