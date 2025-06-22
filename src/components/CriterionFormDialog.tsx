'use client';

import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

import { useCreateCriterion, useUpdateCriterion } from "@/lib/hooks/api/criteria";
import { useToast } from "@/lib/hooks/use-toast-store";
import { Criterion, CreateCriterionPayload, UpdateCriterionPayload } from "@/lib/types/criterion";

interface CriterionFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingCriterion: Criterion | null;
    existingCriteria: Criterion[];
}

export function CriterionFormDialog({ open, onOpenChange, editingCriterion, existingCriteria }: CriterionFormDialogProps) {
    const { showSuccessToast, showErrorToast } = useToast();

    // Use useMemo to create a schema that is aware of the component's props.
    // It will be re-calculated only if `existingCriteria` or `editingCriterion` changes.
    const criteriaSchema = useMemo(() => {
        // Calculate the sum of weights of all *other* criteria.
        const otherCriteriaWeight = existingCriteria
            .filter(c => c.id !== editingCriterion?.id) // Exclude the item being edited
            .reduce((sum, c) => sum + c.weight, 0);

        const maxAllowedWeight = 100 - otherCriteriaWeight;

        return z.object({
            name: z.string().min(1, "Name is required"),
            description: z.string().optional(),
            weight: z.coerce.number()
                .min(0, "Weight must be positive")
                // Use the dynamically calculated max weight in the validation message.
                .max(maxAllowedWeight, `Total weight exceeds 100%. Max allowed is ${maxAllowedWeight.toFixed(1)}%.`),
        });
    }, [existingCriteria, editingCriterion]);

    // This type is inferred from our dynamic schema
    type CriteriaFormData = z.infer<typeof criteriaSchema>;

    const createMutation = useCreateCriterion();
    const updateMutation = useUpdateCriterion();
    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    const form = useForm<CriteriaFormData>({
        resolver: zodResolver(criteriaSchema),
        defaultValues: { name: "", description: "", weight: 0 },
        // Validate on change for better UX
        mode: "onChange",
    });

    // Watch the current value of the weight input for real-time feedback
    const currentWeight = useWatch({ control: form.control, name: 'weight' });

    // Calculate the total weight of other criteria (excluding the one being edited)
    const otherCriteriaWeight = existingCriteria
        .filter(c => c.id !== editingCriterion?.id)
        .reduce((sum, c) => sum + c.weight, 0);

    // The prospective total weight if the form is submitted
    const newTotalWeight = otherCriteriaWeight + (Number(currentWeight) || 0);

    // Effect to reset the form when the dialog opens
    useEffect(() => {
        if (open) {
            if (editingCriterion) {
                form.reset({
                    name: editingCriterion.name,
                    description: editingCriterion.description || "",
                    weight: editingCriterion.weight,
                });
            } else {
                form.reset({ name: "", description: "", weight: 0 });
            }
        }
    }, [open, editingCriterion, form]);

    const onSubmit = (data: CriteriaFormData) => {
        const commonCallbacks = {
            onSuccess: () => {
                showSuccessToast(`Criterion ${editingCriterion ? 'updated' : 'created'} successfully!`);
                onOpenChange(false);
            },
            onError: (error: Error) => {
                showErrorToast(error.message || "An unexpected error occurred.");
            },
        };

        if (editingCriterion) {
            const { dirtyFields } = form.formState;
            if (Object.keys(dirtyFields).length === 0) {
                onOpenChange(false);
                return;
            }
            const updatePayload: UpdateCriterionPayload = {};
            if (dirtyFields.name) updatePayload.name = data.name;
            if (dirtyFields.description) updatePayload.description = data.description;
            if (dirtyFields.weight) updatePayload.weight = data.weight;
            updateMutation.mutate({ id: editingCriterion.id, data: updatePayload }, commonCallbacks);
        } else {
            const createPayload: CreateCriterionPayload = data;
            createMutation.mutate(createPayload, commonCallbacks);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingCriterion ? 'Edit Criterion' : 'Add New Criterion'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Criterion Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="e.g., Teaching Effectiveness" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} rows={3} placeholder="Describe what this criterion evaluates..." />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="weight"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Weight (%)</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="number" min="0" max="100" step="1" placeholder="25" />
                                    </FormControl>
                                    <FormDescription>
                                        Prospective Total Weight: {' '}
                                        <span className={newTotalWeight > 100 ? "font-bold text-destructive" : "font-medium text-muted-foreground"}>
                                            {newTotalWeight.toFixed(1)}% / 100%
                                        </span>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end space-x-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingCriterion ? 'Update Criterion' : 'Create Criterion'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}