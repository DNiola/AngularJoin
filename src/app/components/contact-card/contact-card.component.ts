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

  constructor(private contactService: ContactService, private firestore: AngularFirestore, private afAuth: AngularFireAuth, public helperService: HelperService, private cdr: ChangeDetectorRef) { }


  public ngAfterViewInit(): void {
    if (this.isEditContact && this.contact) {
      this.setFormValues();
    }
    this.cdr.detectChanges();
  }


  public ngOnChanges(changes: SimpleChanges): void {
    if (this.isEditContact && changes['contact'] && this.nameField) {
      this.setFormValues();
    }
  }


  private setFormValues(): void {
    if (this.nameField && this.contact) {
      this.nameField.setValue(this.contact.name || '');
      this.emailField.setValue(this.contact.email || '');
      this.phoneField.setValue(this.contact.phone || '');
    }
  }


  private getFormValues(): { name: string, email: string, phone: string } {
    return {
      name: this.nameField.getValue(),
      email: this.emailField.getValue(),
      phone: this.phoneField.getValue(),
    };
  }


  public onHandleForm(): void {
    this.isEditContact ? this.handleEditContact() : this.handleCreateContact();
  }


  private handleEditContact(): void {
    this.afAuth.currentUser.then((user) => {
      if (user) {
        const creatorId = this.contact.creatorId ? this.contact.creatorId : '';
        const { userId, newContact } = this.getEditContactData(creatorId);
        creatorId ? this.editContact(creatorId, newContact) : this.editUserContact(userId, newContact)
      }
    });
  }


  private getEditContactData(creatorId: Contact['creatorId']): { userId: Contact['userId'], newContact: Contact } {
    const { name, email, phone } = this.getFormValues();
    const initials = this.helperService.getInitials(name);
    const color = this.contact.color
    const userId = this.contact.userId

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


  private handleCreateContact(): void {
    this.afAuth.currentUser.then((user) => {
      if (user) {
        const creatorId = user.uid;
        const newContact = this.getCreateContactData(creatorId);
        this.createContact(creatorId, newContact)
      }
    });
  }


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


  private editContact(creatorId: Contact['creatorId'], newContact: Contact): void {
    this.contactService.updateCreatorContact(creatorId, newContact)
      .then(() => {
        this.closeCard.emit(newContact);
        this.emptyField();
      })
      .catch((error) => {
        console.error('Fehler beim Aktualisieren des Kontakts:', error);
      });
  }


  private editUserContact(userId: User['userId'], newContact: Contact): void {
    this.contactService.updateUserContact(userId, newContact)
      .then(() => {
        this.closeCard.emit(newContact);
        this.emptyField();
      })
      .catch((error) => {
        console.error('Fehler beim Aktualisieren des Kontakts:', error);
      });
  }


  private createContact(creatorId: Contact['creatorId'], newContact: Contact): void {
    this.contactService.saveContact(creatorId, newContact)
      .then(() => {
        this.closeCard.emit(newContact);
        this.emptyField();
      })
      .catch((error) => {
        console.error('Fehler beim Speichern des Kontakts:', error);
      });
  }


  public onCloseCard(): void {
    this.closeCard.emit();
  }


  private emptyField(): void {
    this.nameField.setValue('');
    this.emailField.setValue('');
    this.phoneField.setValue('');
  }
}
