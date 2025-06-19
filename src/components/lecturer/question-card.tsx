// /app/admin/questionnaires/components/question-card.tsx

"use client";

import {UseFormReturn} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {Card, CardContent} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Slider} from "@/components/ui/slider";
import {Badge} from "@/components/ui/badge";
import {Star, SlidersHorizontal, MessageSquare, Trash2, HelpCircle} from "lucide-react";
import {QuestionnaireBuilderData} from "@/lib/schema";
import {Criterion} from "@/lib/types/criterion";

interface QuestionCardProps {
    index: number,
    form: UseFormReturn<QuestionnaireBuilderData>,
    remove: (index: number) => void,
    criteria?: Criterion[]
}

export function QuestionCard({index, form, remove, criteria}: QuestionCardProps) {
    const questionType = form.watch(`questions.${index}.question_type`);
    const typeIcons = {rating: <Star/>, slider: <SlidersHorizontal/>, text: <MessageSquare/>};

    return (
        // UPDATED: Added a subtle background and a border for dark mode to create depth.
        <Card className="bg-slate-50 dark:bg-slate-900/70 border dark:border-slate-800">
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                    <Badge variant="secondary"
                           className="capitalize flex items-center gap-2">{typeIcons[questionType]} Question
                        #{index + 1}</Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500"
                            onClick={() => remove(index)}><Trash2 className="h-4 w-4"/></Button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <FormField control={form.control} name={`questions.${index}.question_text`}
                                   render={({field}) => (
                                       <FormItem><FormLabel>Question Text</FormLabel><FormControl><Textarea
                                           placeholder="e.g., How would you rate the instructor's clarity?" {...field} /></FormControl><FormMessage/></FormItem>)}/>
                        {criteria && <FormField control={form.control} name={`questions.${index}.criteria_id`} render={({field}) => (
                            <FormItem>
                                <FormLabel>Associated Criterion</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue
                                        placeholder="Select a criterion"/></SelectTrigger></FormControl>
                                    <SelectContent>{criteria.map(c => (<SelectItem key={c.id}
                                                                                   value={c.id.toString()}> {c.name} </SelectItem>))}</SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}/>}
                    </div>
                    {/* UPDATED: Gave the preview box a more defined border in dark mode. */}
                    <div className="space-y-2 p-4 border rounded-md bg-background dark:border-slate-700">
                        <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                            <HelpCircle/>Input Preview</h4>
                        {questionType === 'rating' && (<fieldset disabled className="space-y-2"><RadioGroup
                            className="flex space-x-4">{[1, 2, 3, 4, 5].map(v => (
                            <div key={v} className="flex items-center space-x-2"><RadioGroupItem value={v.toString()}
                                                                                                 id={`p-${index}-${v}`}/><label
                                htmlFor={`p-${index}-${v}`}>{v}</label></div>))}</RadioGroup><p
                            className="text-xs text-muted-foreground">Standard 1-5 rating scale</p></fieldset>)}
                        {questionType === 'slider' && (
                            <fieldset disabled className="pt-2"><Slider defaultValue={[50]} max={100} step={1}/><p
                                className="text-xs text-muted-foreground pt-2">0-100 slider</p></fieldset>)}
                        {questionType === 'text' && (
                            <fieldset disabled><Textarea placeholder="Student will type their response here..."/><p
                                className="text-xs text-muted-foreground pt-2">Free text input</p></fieldset>)}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}