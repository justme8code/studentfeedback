import {Department} from "@/lib/types/department";

export interface Lecturer{
    id?:number,
    full_name:string,
    email:string,
    department?:Department,
}
