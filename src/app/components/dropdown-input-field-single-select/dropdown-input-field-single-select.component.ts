import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Category } from 'src/app/models/category.model';

/**
 * DropdownInputFieldSingleSelectComponent
 * Component for displaying a dropdown input field with single select functionality for categories.
 */
@Component({
  selector: 'app-dropdown-input-field-single-select',
  templateUrl: './dropdown-input-field-single-select.component.html',
  styleUrls: ['./dropdown-input-field-single-select.component.scss'],
})
export class DropdownInputFieldSingleSelectComponent implements OnInit {

  @Input() items: Category[] = [];
  @Input() editValueMode: Category | null = null;
  @Input() fieldRequired = false;
  @Input() resetTrigger: boolean = false;
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() errorMessage: boolean = false;

  @Output() outputValue = new EventEmitter<Category>();
  @Output() dropdownOpened = new EventEmitter<boolean>();

  public filteredItems: Category[] = [];
  public isDropdownOpen = false;
  public selectedItemValue: Category | null = null;
  public selectedItemName = '';


  constructor(private eRef: ElementRef) { }


  /**
   * Initializes the component and sets the initial selection if in edit mode.
   *
   * If the component is initialized with an existing value (`editValueMode`),
   * it finds the corresponding item from the list of items and marks it as selected.
   * Additionally, it copies all items to `filteredItems` for display.
   */
  public ngOnInit(): void {
    if (this.editValueMode) {
      this.items.forEach(item => {
        item.selected = false;
      });
      const editItem = this.items.find(item => item.name === this.editValueMode?.name);
      if (editItem) {
        editItem.selected = true;
        this.selectedItemValue = editItem;
        this.selectedItemName = editItem.name;
      }
      this.filteredItems = [...this.items];
    }
  }


  /**
   * Called when any data-bound property of a directive changes.
   *
   * If `resetTrigger` is true, it will reset the selection to its initial state.
   */
  public ngOnChanges(): void {
    if (this.resetTrigger) {
      this.resetSelection();
    }
  }


  /**
   * Toggles the dropdown open state.
   *
   * Emits an event (`dropdownOpened`) with the current open state of the dropdown.
   *
   * @returns {void}
   */
  public toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    this.dropdownOpened.emit(this.isDropdownOpen);
  }


  /**
   * Selects an item from the dropdown.
   *
   * @param {Category} item - The item to be selected.
   *
   * This function will deselect all items, mark the provided item as selected,
   * and close the dropdown. It also updates the search term with the selected
   * item's name and emits the selected item (`outputValue`).
   *
   * @returns {void}
   */
  public selectItem(item: Category): void {
    this.items.forEach(it => {
      it.selected = false;
    });
    item.selected = true;
    this.selectedItemValue = item;
    this.isDropdownOpen = false;
    this.selectedItemName = item.name;
    this.outputValue.emit(item);
  }


  /**
   * Resets the selection to the initial state.
   *
   * Clears the currently selected item and search term, and marks all items as not selected.
   *
   * @returns {void}
   */
  private resetSelection(): void {
    this.selectedItemValue = null;
    this.selectedItemName = '';
    this.items.forEach(item => {
      item.selected = false;
    });
  }


  /**
   * Handles click events outside the component.
   *
   * @param {Event} event - The click event.
   *
   * If the click is outside the component, it closes the dropdown and emits `dropdownOpened` with `false`.
   *
   * @returns {void}
   */
  @HostListener('document:click', ['$event'])
  public onClickOutside(event: Event): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
      this.dropdownOpened.emit(false);
    }
  }
}
