import { Category } from "./category.model";
import { Contact } from "./contact.model";
import { User } from "./user.model";

export interface Task {
    title: string;
    description?: string;
    assignedTo?: Contact[];
    dueDate: string;
    prio?: string;
    category: Category[];
    creatorId: string;
    subtasks?: string[];
}


