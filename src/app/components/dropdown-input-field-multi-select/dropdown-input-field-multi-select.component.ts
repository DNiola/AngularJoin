import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Contact } from 'src/app/models/contact.model';

/**
 * A multi-select dropdown input field component that allows users to select multiple items from a list.
 */
@Component({
  selector: 'app-dropdown-input-field-multi-select',
  templateUrl: './dropdown-input-field-multi-select.component.html',
  styleUrls: ['./dropdown-input-field-multi-select.component.scss'],
})
export class DropdownInputFieldMultiSelectComponent implements OnInit {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() items: Contact[] = [];
  @Input() preselectedItems: Contact[] | undefined = [];
  @Input() resetTrigger = false;

  @Output() selectedItemsChange = new EventEmitter<any[]>();

  public searchTerm = '';
  public filteredItems: Contact[] | null = null;
  public selectedItems: Array<any> = [];
  public isDropdownOpen = false;

  constructor(private eRef: ElementRef) { }

  
  /**
   * Initializes the component by pre-selecting items if provided.
   * Sets up the filtered items and selected items list based on the preselected items.
   */
  public ngOnInit(): void {
    if (this.preselectedItems) {
      this.items.forEach(item => item.selected = false);
      this.items.forEach(item => {
        const editItem = this.preselectedItems?.find((edit: any) => edit.userId === item.userId);
        if (editItem) {
          item.selected = editItem.selected;
        }
      });
      this.filteredItems = [...this.items];
      this.selectedItems = this.filteredItems.filter(item => item.selected);
    }
  }


  /**
   * Reacts to changes in input properties, specifically to reset the dropdown when triggered.
   * 
   * @param changes - The changes in input properties.
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['resetTrigger']) {
      this.clearDropdown();
    }
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
    if (item.selected) {
      item.selected = false;
      this.selectedItems = this.selectedItems.filter(selected => selected !== item);
    } else {
      item.selected = true;
      this.selectedItems.push(item);
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
