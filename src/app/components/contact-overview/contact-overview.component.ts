import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Contact } from 'src/app/models/contact.model';

@Component({
  selector: 'app-contact-overview',
  templateUrl: './contact-overview.component.html',
  styleUrls: ['./contact-overview.component.scss'],
})
export class ContactOverviewComponent {
  @Input() selectedContact: Contact | null = null;

  @Output() handleContact = new EventEmitter<{ action: 'delete' | 'edit'; contact: Contact }>();

  public isDialog = false;


  public onDeleteContact(contact: Contact): void {
    this.handleContact.emit({ action: 'delete', contact });
    this.isDialog = false;
  }

  public onEditContact(contact: Contact): void {
    this.handleContact.emit({ action: 'edit', contact });
  }

}
