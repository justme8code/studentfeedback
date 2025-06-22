import {Department} from "@/lib/types/department";

export interface Lecturer{
    id:string,
    full_name:string,
    email:string,
    department:Department,
}
