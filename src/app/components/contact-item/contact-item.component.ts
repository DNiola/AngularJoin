import { Component, Input } from '@angular/core';
import { Contact } from 'src/app/models/contact.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-contact-item',
  templateUrl: './contact-item.component.html',
  styleUrls: ['./contact-item.component.scss'],
})
export class ContactItemComponent {
  @Input() contact: Contact | null = null;
  @Input() currentUser: User | null = null;
  @Input() selectedContact: Contact | null = null;
}
