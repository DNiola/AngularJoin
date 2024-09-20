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
    subtasks?: subTask[];
    status: 'todo' | 'inProgress' | 'awaitFeedback' | 'done';
}

export interface subTask {
    title: string;
    done: boolean;
}

export type subTasks = subTask[];
