import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Contact } from 'src/app/models/contact.model';
import { ContactService } from 'src/app/services/contact.service';
import { HelperService } from 'src/app/services/helper.service';
import { AuthInputFieldsComponent } from '../auth-input-fields/auth-input-fields.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-contact-card',
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.scss'],
})
export class ContactCardComponent {
  @ViewChild('nameField') nameField!: AuthInputFieldsComponent;
  @ViewChild('emailField') emailField!: AuthInputFieldsComponent;
  @ViewChild('phoneField') phoneField!: AuthInputFieldsComponent;

  @Output() closeCard = new EventEmitter<Contact>();

  public isEditContact = false;
  public contact: Contact = { name: '', color: '', initials: '', userId: '' };
  
  constructor(private contactService: ContactService, private firestore: AngularFirestore, private afAuth: AngularFireAuth, public helperService: HelperService) { }


  public onCreateContact(): void {
    this.afAuth.currentUser.then((user) => {
      if (user) {
        const creatorId = user.uid;
        const name = this.nameField.getValue();
        const email = this.emailField.getValue();
        const phone = this.phoneField.getValue();
        const initials = this.helperService.getInitials(name);
        const color = this.helperService.getRandomColor();
        const userId = this.firestore.createId();

        const newContact: Contact = {
          userId,
          name,
          email,
          phone,
          initials,
          color,
          creatorId,
        };

        this.contactService.saveContact(creatorId, newContact)
          .then(() => {
            this.closeCard.emit(newContact);
          })
          .catch((error) => {
            console.error('Fehler beim Speichern des Kontakts:', error);
          });
      }
    });
  }


  onCloseCard() {
    this.closeCard.emit();
  }
}
