import { Injectable } from '@angular/core';
import { Contact } from '../models/contact.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private firestore: AngularFirestore) { }

  public saveContact(creatorId: Contact['creatorId'], newContact: Contact): Promise<void> {
    const userRef = this.firestore.collection('users').doc(creatorId);

    return this.firestore.firestore.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef.ref);

      if (!userDoc.exists) {
        throw new Error('Benutzer existiert nicht');
      }

      const userData = userDoc.data() as any;
      const updatedContacts = userData.contacts ? [...userData.contacts, newContact] : [newContact];

      transaction.update(userRef.ref, { contacts: updatedContacts });
    });
  }


  public async updateUserContact(userId: User['userId'], updatedContact: Contact): Promise<void> {
    const userRef = this.firestore.collection('users').doc(userId);

    return userRef.update(updatedContact)
      .then(() => {
        console.log("Benutzerprofil erfolgreich aktualisiert");
      })
      .catch((error) => {
        console.error("Fehler beim Aktualisieren des Benutzerprofils:", error);
      });
  }


  public async updateCreatorContact(creatorId: Contact['creatorId'], updatedContact: Contact): Promise<void> {
    const userRef = this.firestore.collection('users').doc(creatorId);

    return this.firestore.firestore.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef.ref);

      if (!userDoc.exists) {
        throw new Error('Ersteller existiert nicht.');
      }

      const userData = userDoc.data() as any;

      const updatedContacts = userData.contacts.map((c: Contact) =>
        c.userId === updatedContact.userId ? updatedContact : c
      );

      transaction.update(userRef.ref, { contacts: updatedContacts });
    });
  }


  public deleteUserContact(currentUserId: Contact['creatorId'], contactId: string): Promise<void> {
    const userRef = this.firestore.collection('users').doc(currentUserId);

    return this.firestore.firestore.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef.ref);

      if (!userDoc.exists) {
        throw new Error('Benutzer existiert nicht.');
      }

      const userData = userDoc.data() as any;
      const updatedContacts = userData.contacts.filter((c: Contact) => c.userId !== contactId);

      transaction.update(userRef.ref, { contacts: updatedContacts });
    });
  }


  public hideUserForCurrentUser(currentUserId: string, contact: Contact): Promise<void> {
    const userRef = this.firestore.collection('users').doc(currentUserId);

    return this.firestore.firestore.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef.ref);

      if (!userDoc.exists) {
        throw new Error('Benutzer existiert nicht.');
      }

      const userData = userDoc.data() as any;
      const updatedHidden = userData.hidden ? [...userData.hidden, contact.userId] : [contact.userId];

      transaction.update(userRef.ref, { hidden: updatedHidden });
    });
  }

}
