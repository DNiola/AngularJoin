export interface Contact {
    name: string;
    selected?: boolean;
    color: string;
    initials: string;
    userId: string;
    email?: string;
    contacts: Contact[];   
}