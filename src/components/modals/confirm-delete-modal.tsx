import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDeleteModalProps {
  open: boolean;
  title?: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmDeleteModal({
  open,
  title = "Are you sure?",
  description,
  onConfirm,
  onCancel,
  confirmText = "Delete",
  cancelText = "Cancel",
}: ConfirmDeleteModalProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="py-2 text-sm text-muted-foreground">{description}</div>
        <DialogFooter className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onCancel}>{cancelText}</Button>
          <Button variant="destructive" onClick={onConfirm}>{confirmText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

