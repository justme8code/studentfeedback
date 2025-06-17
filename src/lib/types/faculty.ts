import {Department} from "@/lib/types/department";

export interface Faculty {
    id: string;
    name: string;
    departments?: Department[]; // Array of department IDs
}