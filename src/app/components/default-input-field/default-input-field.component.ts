import { Component, Input, OnInit } from '@angular/core';
import { Contact } from 'src/app/models/contact.model';


@Component({
  selector: 'app-default-input-field',
  templateUrl: './default-input-field.component.html',
  styleUrls: ['./default-input-field.component.scss'],
})
export class DefaultInputFieldComponent implements OnInit {
  @Input() fieldRequired = false;
  @Input() label = '';
  @Input() contacts: Contact[] = [];
  @Input() dropDown = false;
  @Input() placeholder = '';
  @Input() type = 'text'; 
  public selectedContacts: Array<any> = []; isDropdownOpen = false;
  public noContactsFound = false;

  public searchTerm: string = '';

  public filteredContacts = [...this.contacts];
  constructor() { }

  ngOnInit() { }

  public toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.filterContacts();
    }
  }


  public filterContacts(): void {
    this.filteredContacts = this.contacts.filter(contact =>
      contact.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.noContactsFound = this.filteredContacts.length === 0;
  }


  public toggleContact(contact: any): void {
    contact.selected = !contact.selected;
    this.selectedContacts = this.contacts.filter(c => c.selected);
  }

}
