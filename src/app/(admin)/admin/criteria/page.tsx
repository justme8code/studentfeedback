'use client';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react";

// --- MOCK DATA ---
const mockInitialCriteria = [
  { id: 1, name: "Teaching Clarity", description: "Clarity of explanations and lectures.", weight: 30, isActive: true, createdAt: "2023-01-10T00:00:00Z" },
  { id: 2, name: "Course Material", description: "Relevance and quality of materials.", weight: 25, isActive: true, createdAt: "2023-01-11T00:00:00Z" },
  { id: 3, name: "Assessment Fairness", description: "Fairness of exams and assignments.", weight: 25, isActive: true, createdAt: "2023-01-12T00:00:00Z" },
  { id: 4, name: "Engagement", description: "Lecturer's ability to engage students.", weight: 20, isActive: false, createdAt: "2023-01-13T00:00:00Z" },
];
// --- END MOCK DATA ---

const criteriaSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  weight: z.coerce.number().min(0, "Weight must be positive").max(100, "Weight cannot exceed 100"),
});

type CriteriaFormData = z.infer<typeof criteriaSchema>;
type Criterion = { id: number; name: string; description?: string; weight: number; isActive: boolean; createdAt: string; };

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState<Criterion | null>(null);
  const [criteria, setCriteria] = useState<Criterion[]>(mockInitialCriteria);

  const setLocation = (path: string) => {
    console.log(`Navigating to: ${path}`);
    alert(`This would navigate to ${path}`);
  };

  const form = useForm<CriteriaFormData>({
    resolver: zodResolver(criteriaSchema),
    defaultValues: { name: "", description: "", weight: 0 },
  });

  const onSubmit = (data: CriteriaFormData) => {
    setIsSubmitting(true);
    console.log("Submitting criteria data:", data);

    // Simulate API call
    setTimeout(() => {
      if (editingCriteria) {
        // Update existing criterion
        setCriteria(criteria.map(c =>
            c.id === editingCriteria.id ? { ...c, ...data } : c
        ));
        alert("Criterion updated successfully!");
      } else {
        // Create new criterion
        const newCriterion: Criterion = {
          id: Math.max(0, ...criteria.map(c => c.id)) + 1,
          ...data,
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        setCriteria([...criteria, newCriterion]);
        alert("Criterion created successfully!");
      }
      setIsSubmitting(false);
      setIsDialogOpen(false);
      setEditingCriteria(null);
      form.reset({ name: "", description: "", weight: 0 });
    }, 1000);
  };

  const handleEdit = (criterion: Criterion) => {
    setEditingCriteria(criterion);
    form.reset({
      name: criterion.name,
      description: criterion.description || "",
      weight: criterion.weight,
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingCriteria(null);
    form.reset({ name: "", description: "", weight: 0 });
    setIsDialogOpen(true);
  };

  const handleDelete = (criterionId: number) => {
    if (window.confirm("Are you sure you want to delete this criterion?")) {
      console.log(`Deleting criterion with ID: ${criterionId}`);
      setCriteria(criteria.filter(c => c.id !== criterionId));
      alert("Criterion deleted.");
    }
  };

  const totalWeight = criteria.reduce((sum, c) => sum + (c.weight || 0), 0);

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Button variant="ghost" onClick={() => setLocation("/")} className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Feedback Criteria Management</h1>
                  <p className="text-sm text-gray-600">Manage the criteria used for course evaluations</p>
                </div>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleAdd}><Plus className="h-4 w-4 mr-2" />Add Criterion</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingCriteria ? 'Edit Criterion' : 'Add New Criterion'}</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      {/* Form Fields */}
                      <FormField control={form.control} name="name" render={({ field }) => (
                          <FormItem><FormLabel>Criterion Name</FormLabel><FormControl><Input {...field} placeholder="e.g., Teaching Effectiveness"/></FormControl><FormMessage /></FormItem>
                      )}/>
                      <FormField control={form.control} name="description" render={({ field }) => (
                          <FormItem><FormLabel>Description (Optional)</FormLabel><FormControl><Textarea {...field} rows={3} placeholder="Describe what this criterion evaluates..."/></FormControl><FormMessage /></FormItem>
                      )}/>
                      <FormField control={form.control} name="weight" render={({ field }) => (
                          <FormItem><FormLabel>Weight (%)</FormLabel><FormControl><Input {...field} type="number" min="0" max="100" step="1" placeholder="25"/></FormControl><FormMessage /></FormItem>
                      )}/>
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? (editingCriteria ? "Updating..." : "Creating...") : (editingCriteria ? "Update Criterion" : "Create Criterion")}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader><CardTitle>Current Criteria</CardTitle></CardHeader>
            <CardContent>
              {criteria.length > 0 ? (
                  <div className="space-y-4">
                    {criteria.map((criterion) => (
                        <div key={criterion.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <h3 className="font-medium text-gray-900">{criterion.name}</h3>
                                <Badge variant="secondary">{criterion.weight.toFixed(1)}%</Badge>
                                <Badge className={criterion.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}>
                                  {criterion.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                              {criterion.description && <p className="text-sm text-gray-600 mb-2">{criterion.description}</p>}
                              <p className="text-xs text-gray-500">Created: {new Date(criterion.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(criterion)}><Edit className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDelete(criterion.id)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </div>
                        </div>
                    ))}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Weight Distribution</h4>
                      <div className="text-sm text-blue-700">
                        Total Weight: {totalWeight.toFixed(1)}%
                        {totalWeight !== 100 && <span className="text-orange-600 ml-2">(Should total 100% for balanced evaluation)</span>}
                      </div>
                    </div>
                  </div>
              ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No feedback criteria defined yet.</p>
                    <Button onClick={handleAdd}><Plus className="h-4 w-4 mr-2" />Add Your First Criterion</Button>
                  </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
  );
}