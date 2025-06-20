'use client';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Calendar } from "lucide-react";

const feedbackRoundSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
}).refine((data) => {
  if (!data.startDate || !data.endDate) return true; // Don't validate if dates are missing
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return start < end;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

type FeedbackRoundFormData = z.infer<typeof feedbackRoundSchema>;

export default function FeedbackRoundForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock navigation function
  const setLocation = (path: string) => {
    console.log(`Navigating to: ${path}`);
    alert(`This would navigate to ${path}`);
  };

  const form = useForm<FeedbackRoundFormData>({
    resolver: zodResolver(feedbackRoundSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
    },
  });

  const onSubmit = (data: FeedbackRoundFormData) => {
    setIsSubmitting(true);
    console.log("Submitting new feedback round:", data);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Success! Feedback round created successfully.");
      setLocation("/");
    }, 1500);
  };

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center">
              <Button
                  variant="ghost"
                  onClick={() => setLocation("/")}
                  className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Create Feedback Round</h1>
                <p className="text-sm text-gray-600">
                  Set up a new feedback collection period
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Feedback Round Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                          <FormItem>
                            <FormLabel>Round Name</FormLabel>
                            <FormControl>
                              <Input
                                  {...field}
                                  placeholder="e.g., Mid-Semester Evaluation 2024"
                              />
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
                              <Textarea
                                  {...field}
                                  rows={3}
                                  placeholder="Provide additional details about this feedback round..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                      )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date</FormLabel>
                              <FormControl>
                                <Input
                                    {...field}
                                    type="date"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date</FormLabel>
                              <FormControl>
                                <Input
                                    {...field}
                                    type="date"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                        )}
                    />
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setLocation("/")}
                        disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating..." : "Create Round"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}