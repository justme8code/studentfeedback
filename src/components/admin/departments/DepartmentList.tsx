import React, { useEffect, useState } from "react";
import { useDepartmentStore } from "@/lib/hooks/useDepartmentStore";
import { fetchAllDepartments, deleteDepartment } from "@/lib/api/calls/department";
import { useFacultyStore } from "@/lib/hooks/useFacultyStore";
import { fetchAllFaculties } from "@/lib/api/calls/faculty";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/hooks/use-toast-store";
import { Trash2, Pencil, Building2 } from "lucide-react";
import { ConfirmDeleteModal } from "@/components/modals/confirm-delete-modal";

export function DepartmentList({ onEdit }: { onEdit?: (id: string) => void }) {
  const { departments, setDepartments, removeDepartment } = useDepartmentStore();
  const { faculties, setFaculties } = useFacultyStore();
  const { showSuccessToast, showErrorToast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchAllDepartments().then((res) => {
      if (res.status && res.data) setDepartments(res.data);
    });
    fetchAllFaculties().then((res) => {
      if (res.status && res.data) setFaculties(res.data);
    });
  }, [setDepartments, setFaculties]);

  const handleDelete = async () => {
    if (!deleteId) return;
    const res = await deleteDepartment(deleteId);
    if (res.status) {
      removeDepartment(deleteId);
      showSuccessToast("Department deleted successfully!");
    } else {
      showErrorToast(res.error?.message || "Failed to delete department.");
    }
    setDeleteId(null);
    setModalOpen(false);
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Building2 className="w-6 h-6 text-primary" /> Departments
      </h2>
      <ul className="space-y-3">
        {departments.map((department) => (
          <li key={department.id} className="flex items-center justify-between border p-4 rounded-lg shadow-sm  hover:shadow-md transition">
            <span className="flex items-center gap-2 font-medium text-base">
              <Building2 className="w-5 h-5 text-green-600" /> {department.name}
              <span className="text-xs text-gray-500">({department.faculty?.name || "Unknown Faculty"})</span>
            </span>
            <div className="space-x-2 flex">
              {onEdit && (
                <Button size="icon" variant="outline" onClick={() => onEdit(department.id)} title="Edit">
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
              <Button size="icon" variant="destructive" onClick={() => { setDeleteId(department.id); setModalOpen(true); }} title="Delete">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <ConfirmDeleteModal
        open={modalOpen}
        title="Delete Department?"
        description="If this department is deleted, all related data might be affected. Are you sure you want to proceed?"
        onConfirm={handleDelete}
        onCancel={() => { setModalOpen(false); setDeleteId(null); }}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
