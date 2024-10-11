export interface Contact {
    name: string;
    selected?: boolean;
    color: string;
    initials: string;
    userId: string;
    email?: string;
    contacts?: Contact[];   
    phone?: string;
    creatorId ?: string;
}

export type Contacts = Contact[];