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
    subtasks?: Subtask[];
    status: 'todo' | 'inProgress' | 'awaitFeedback' | 'done';
    id: string;
}

export interface Subtask {
    title: string;
    done: boolean;
}

export type subTasks = Subtask[];
