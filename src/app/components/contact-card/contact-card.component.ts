import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
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
export class ContactCardComponent {
  @ViewChild('nameField') nameField!: AuthInputFieldsComponent;
  @ViewChild('emailField') emailField!: AuthInputFieldsComponent;
  @ViewChild('phoneField') phoneField!: AuthInputFieldsComponent;

  @Input() public isEditContact = false;
  @Input() public contact: Contact = { name: '', color: '', initials: '', userId: '' };

  @Output() closeCard = new EventEmitter<Contact>();
  @Output() deleteContact = new EventEmitter<{ action: 'delete'; contact: Contact }>();

  public dialogMessage = { title: '', message: '', action: '' };
  public isDialog = false;

  constructor(
    private contactService: ContactService,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    public helperService: HelperService,
    private cdr: ChangeDetectorRef
  ) {}


  /**
   * Lifecycle hook that is called after Angular has fully initialized the view.
   * Sets form values if in edit mode and detects changes.
   *
   * @returns {void}
   */
  public ngAfterViewInit(): void {
    if (this.isEditContact && this.contact) {
      this.setFormValues();
    }
    this.cdr.detectChanges();
  }


  /**
   * Lifecycle hook that is called when any data-bound property of a directive changes.
   * Updates form values if contact information changes in edit mode.
   *
   * @param {SimpleChanges} changes - The changes that occurred.
   * @returns {void}
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (this.isEditContact && changes['contact'] && this.nameField) {
      this.setFormValues();
    }
  }


  /**
   * Sets the form values for name, email, and phone fields based on the contact input.
   *
   * @private
   * @returns {void}
   */
  private setFormValues(): void {
    if (this.nameField && this.contact) {
      this.nameField.setValue(this.contact.name || '');
      this.emailField.setValue(this.contact.email || '');
      this.phoneField.setValue(this.contact.phone || '');
    }
  }


  /**
   * Retrieves the current values from the form fields.
   *
   * @private
   * @returns {{ name: string, email: string, phone: string }} An object containing the name, email, and phone values.
   */
  private getFormValues(): { name: string, email: string, phone: string } {
    return {
      name: this.nameField.getValue(),
      email: this.emailField.getValue(),
      phone: this.phoneField.getValue(),
    };
  }


  /**
   * Checks if any of the form fields are empty.
   *
   * @returns {boolean} True if any fields are empty, false otherwise.
   */
  public isFieldsEmpty(): boolean {
    return !this.nameField?.getValue().trim() || !this.emailField?.getValue().trim();
  }


  /**
   * Handles form submission to either create or edit a contact.
   *
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  public async onHandleForm(): Promise<void> {
    this.isEditContact ? await this.handleEditContact() : await this.handleCreateContact();
  }


  /**
   * Handles the logic for editing an existing contact.
   *
   * @private
   * @returns {Promise<void>} A promise that resolves when the contact is updated.
   */
  private async handleEditContact(): Promise<void> {
    const user = await this.afAuth.currentUser;
    if (user) {
      const creatorId = this.contact.creatorId ? this.contact.creatorId : '';
      const { userId, newContact } = this.getEditContactData(creatorId);
      creatorId ? await this.editContact(creatorId, newContact) : await this.editUserContact(userId, newContact);
    }
  }


  /**
   * Retrieves the updated contact data for editing.
   *
   * @private
   * @param {Contact['creatorId']} creatorId - The creator ID of the contact.
   * @returns {{ userId: Contact['userId'], newContact: Contact }} An object containing the user ID and the updated contact information.
   */
  private getEditContactData(creatorId: Contact['creatorId']): { userId: Contact['userId'], newContact: Contact } {
    const { name, email, phone } = this.getFormValues();
    const initials = this.helperService.getInitials(name);
    const color = this.contact.color;
    const userId = this.contact.userId;

    const newContact: Contact = {
      userId,
      name,
      email,
      phone,
      initials,
      color,
      creatorId,
    };

    return { userId, newContact };
  }


  /**
   * Handles the logic for creating a new contact.
   *
   * @private
   * @returns {Promise<void>} A promise that resolves when the contact is created.
   */
  private async handleCreateContact(): Promise<void> {
    const user = await this.afAuth.currentUser;
    if (user) {
      const creatorId = user.uid;
      const newContact = this.getCreateContactData(creatorId);
      await this.createContact(creatorId, newContact);
    }
  }


  /**
   * Retrieves the data for creating a new contact.
   *
   * @private
   * @param {Contact['creatorId']} creatorId - The creator ID of the contact.
   * @returns {Contact} The new contact information.
   */
  private getCreateContactData(creatorId: Contact['creatorId']): Contact {
    const { name, email, phone } = this.getFormValues();
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

    return newContact;
  }


  /**
   * Edits an existing contact in the creator's contact list.
   *
   * @private
   * @param {Contact['creatorId']} creatorId - The creator ID of the contact.
   * @param {Contact} newContact - The updated contact information.
   * @returns {Promise<void>} A promise that resolves when the contact is updated.
   */
  private async editContact(creatorId: Contact['creatorId'], newContact: Contact): Promise<void> {
    try {
      await this.contactService.updateCreatorContact(creatorId, newContact);
      this.closeCard.emit(newContact);
      this.emptyField();
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Kontakts:', error);
    }
  }


  /**
   * Edits an existing contact in the user's contact list.
   *
   * @private
   * @param {User['userId']} userId - The user ID of the contact.
   * @param {Contact} newContact - The updated contact information.
   * @returns {Promise<void>} A promise that resolves when the contact is updated.
   */
  private async editUserContact(userId: User['userId'], newContact: Contact): Promise<void> {
    try {
      await this.contactService.updateUserContact(userId, newContact);
      this.closeCard.emit(newContact);
      this.emptyField();
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Kontakts:', error);
    }
  }


  /**
   * Creates a new contact in the creator's contact list.
   *
   * @private
   * @param {Contact['creatorId']} creatorId - The creator ID of the contact.
   * @param {Contact} newContact - The new contact information.
   * @returns {Promise<void>} A promise that resolves when the contact is created.
   */
  private async createContact(creatorId: Contact['creatorId'], newContact: Contact): Promise<void> {
    try {
      await this.contactService.saveContact(creatorId, newContact);
      this.closeCard.emit(newContact);
      this.emptyField();
    } catch (error) {
      console.error('Fehler beim Speichern des Kontakts:', error);
    }
  }


  /**
   * Closes the contact card.
   *
   * @returns {void}
   */
  public onCloseCard(): void {
    this.closeCard.emit();
  }


  /**
   * Clears all input fields and resets the dialog state.
   *
   * @returns {void}
   */
  public emptyField(): void {
    this.nameField.setValue('');
    this.emailField.setValue('');
    this.phoneField.setValue('');
    this.isDialog = false;
  }


  /**
   * Emits an event to delete the contact.
   *
   * @param {Contact} contact - The contact to be deleted.
   * @returns {void}
   */
  public onDeleteContact(contact: Contact): void {
    this.deleteContact.emit({ action: 'delete', contact });
  }


  /**
   * Handles dialog actions such as create, cancel, delete, or edit.
   *
   * @param {'cancel' | 'create' | 'delete' | 'edit'} action - The action to be performed.
   * @returns {void}
   */
  public onHandleDialog(action: 'cancel' | 'create' | 'delete' | 'edit'): void {
    const dialogMessages = {
      create: { title: 'Add new contact', message: 'Are you sure to create this contact?', action: 'create' },
      cancel: { title: 'Cancel', message: 'Are you sure to cancel this action?', action: 'cancel' },
      delete: { title: 'Delete contact', message: 'Are you sure to delete this contact?', action: 'delete' },
      edit: { title: 'Edit contact', message: 'Are you sure to edit this contact?', action: 'edit' },
    };
    this.dialogMessage = dialogMessages[action];
    this.isDialog = true;
  }
}