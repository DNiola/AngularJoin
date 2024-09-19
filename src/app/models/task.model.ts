import { Category } from "./category.model";
import { Contact } from "./contact.model";

export interface Task {
    title: string;
    description?: string;
    assignedTo?: Contact[];
    dueDate: string;
    prio?: string;
    category: Category;
    creatorId: string;
    subtasks?: string[];
    status: 'todo' | 'inProgress' | 'awaitFeedback' | 'done';
}