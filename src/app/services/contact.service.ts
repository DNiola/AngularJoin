import { Injectable } from '@angular/core';
import { Contact } from '../models/contact.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private firestore: AngularFirestore) {}


  /**
   * Saves a new contact for a specific creator.
   * 
   * @param {string} creatorId - The ID of the contact creator.
   * @param {Contact} newContact - The contact to be saved.
   * @returns {Promise<void>} A promise that resolves when the contact is saved.
   * 
   * This function creates a transaction to update the contact list of the specified creator.
   */
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


  /**
   * Updates an existing user contact.
   * 
   * @param {string} userId - The ID of the user whose contact needs to be updated.
   * @param {Contact} updatedContact - The updated contact information.
   * @returns {Promise<void>} A promise that resolves when the contact is updated.
   * 
   * This function directly updates the contact information for the specified user.
   */
  public async updateUserContact(userId: User['userId'], updatedContact: Contact): Promise<void> {
    const userRef = this.firestore.collection('users').doc(userId);

    return userRef.update(updatedContact)
      .then(() => {})
      .catch((error) => {
       throw error
      });
  }


  /**
   * Updates an existing contact for a creator.
   * 
   * @param {string} creatorId - The ID of the creator.
   * @param {Contact} updatedContact - The updated contact information.
   * @returns {Promise<void>} A promise that resolves when the contact is updated.
   * 
   * This function uses a transaction to locate and update the contact within the creator's contact list.
   */
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


  /**
   * Deletes a contact from the user's contact list.
   * 
   * @param {string} currentUserId - The ID of the current user.
   * @param {string} contactId - The ID of the contact to be deleted.
   * @returns {Promise<void>} A promise that resolves when the contact is deleted.
   * 
   * This function uses a transaction to remove the specified contact from the user's contact list.
   */
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

  
  /**
   * Hides a user for the current user.
   * 
   * @param {string} currentUserId - The ID of the current user.
   * @param {Contact} contact - The contact to be hidden.
   * @returns {Promise<void>} A promise that resolves when the contact is hidden.
   * 
   * This function adds the specified contact to the hidden list of the current user.
   */
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
