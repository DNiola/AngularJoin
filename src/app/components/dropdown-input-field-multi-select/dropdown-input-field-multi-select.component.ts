import { Component, ElementRef, EventEmitter, HostListener, Input, Output, SimpleChanges } from '@angular/core';
import { Contact } from 'src/app/models/contact.model';

/**
 * A multi-select dropdown input field component that allows users to select multiple items from a list.
 */
@Component({
  selector: 'app-dropdown-input-field-multi-select',
  templateUrl: './dropdown-input-field-multi-select.component.html',
  styleUrls: ['./dropdown-input-field-multi-select.component.scss'],
})
export class DropdownInputFieldMultiSelectComponent {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() items: Contact[] = [];
  @Input() preselectedItems?: Contact[] = [];
  @Input() resetTrigger = false;

  @Output() selectedItemsChange = new EventEmitter<Contact[]>();

  public searchTerm = '';
  public filteredItems: Contact[] | null = null;
  public selectedItems: Array<Contact> = [];
  public isDropdownOpen = false;

  constructor(private eRef: ElementRef) { }


  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['resetTrigger'] && this.resetTrigger) {
      this.clearDropdown();
      return
    }
    if (changes['items'] && this.items && this.items.length > 0 && this.preselectedItems) {
      this.initializeSelectedItems(this.preselectedItems);
    }
  }


  private initializeSelectedItems(preselectedItems: Contact[]): void {
    this.items = this.items.map(item => ({ ...item }));
    const preselectedIds = new Set(preselectedItems.map(item => item.userId));

    this.items.forEach(item => {
      if (preselectedIds.has(item.userId)) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    });

    this.selectedItems = this.items.filter(item => item.selected);
    this.filteredItems = [...this.items];
  }


  /**
   * Clears the dropdown selections and resets the search term.
   * Sets all items to unselected.
   */
  private clearDropdown(): void {
    this.selectedItems = [];
    this.searchTerm = '';
    this.items.forEach(item => item.selected = false);
  }


  /**
   * Toggles the visibility of the dropdown.
   * If opening, filters the items based on the current search term.
   */
  public toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.filterItems();
    }
    if (this.searchTerm) {
      this.isDropdownOpen = true;
    }
  }


  /**
   * Filters the items in the dropdown based on the search term.
   * Sets the filtered items to those matching the search term.
   */
  public filterItems(): void {
    this.filteredItems = this.items.filter(item =>
      (item.name?.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
    if (this.searchTerm) {
      this.isDropdownOpen = true;
    }
  }


  /**
   * Toggles the selection state of an item in the dropdown.
   * Emits the updated list of selected items.
   * 
   * @param item - The item to be toggled.
   */
  public onToggleItem(item: Contact): void {
    item.selected = !item.selected;

    if (item.selected) {
      this.selectedItems.push(item);
    } else {
      this.selectedItems = this.selectedItems.filter(selectedItem => (selectedItem.userId || selectedItem.email) !== (item.userId || item.email));
    }

    this.selectedItemsChange.emit(this.selectedItems);
  }


  /**
   * Handles clicks outside of the dropdown to close it.
   * 
   * @param event - The click event.
   */
  @HostListener('document:click', ['$event'])
  public clickout(event: Event): void {
    if (this.isDropdownOpen && !this.eRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }
}