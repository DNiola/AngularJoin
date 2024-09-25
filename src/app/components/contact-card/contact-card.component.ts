import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Contact } from 'src/app/models/contact.model';
import { ContactService } from 'src/app/services/contact.service';
import { HelperService } from 'src/app/services/helper.service';
import { AuthInputFieldsComponent } from '../auth-input-fields/auth-input-fields.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-contact-card',
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.scss'],
})
export class ContactCardComponent implements OnInit {
  @ViewChild('nameField') nameField!: AuthInputFieldsComponent;
  @ViewChild('emailField') emailField!: AuthInputFieldsComponent;
  @ViewChild('phoneField') phoneField!: AuthInputFieldsComponent;

  @Output() closeCard = new EventEmitter<void>(); 

  public isEditContact = false;
  public contact: Contact = { name: '', color: '', initials: '', userId: '' };
  constructor(private contactService: ContactService, private firestore: AngularFirestore, private afAuth: AngularFireAuth, public helperService: HelperService) { }

  ngOnInit() { }



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
            console.log('Kontakt erfolgreich gespeichert');
          })
          .catch((error) => {
            console.error('Fehler beim Speichern des Kontakts:', error);
          });
      }
    });
  }
  

  private async saveContactToUser(creatorId: string, newContact: Contact): Promise<void> {
    const userRef = this.firestore.collection('users').doc(creatorId);

    return this.firestore.firestore.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef.ref);

      if (!userDoc.exists) {
        throw new Error('Benutzer existiert nicht');
      }

      // Aktuelle Benutzer-Daten holen
      const userData = userDoc.data() as User;
      const updatedContacts = userData.contacts ? [...userData.contacts, newContact] : [newContact];

      // Benutzer-Dokument mit aktualisiertem contacts[]-Array speichern
      transaction.update(userRef.ref, { contacts: updatedContacts });
    });
  }


  onCloseCard() {
    this.closeCard.emit();
  }
}
