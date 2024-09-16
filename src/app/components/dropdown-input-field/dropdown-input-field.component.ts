import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown-input-field',
  templateUrl: './dropdown-input-field.component.html',
  styleUrls: ['./dropdown-input-field.component.scss'],
})
export class DropdownInputFieldComponent {
  @Input() label = '';
  @Input() items: any[] = [];
  @Input() placeholder = '';
  @Input() fieldRequired = false;

  @Output() selectedData = new EventEmitter<Array<any>>();

  public filteredItems: any[] = [];
  public isDropdownOpen = false;
  public selectedItems: Array<any> = [];
  public searchTerm = '';


  public toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.filterItems();
    }
    if (this.searchTerm) {
      this.isDropdownOpen = true;
    }
  }

  public filterItems(): void {
    this.filteredItems = this.items.filter(item =>
    (item.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.text?.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
    if (this.searchTerm) {
      this.isDropdownOpen = true;
    }
  }

  public toggleItem(item: any): void {
    if (item.selected) {
      item.selected = false;
      this.selectedItems = this.selectedItems.filter(selected => selected !== item);
    } else {
      item.selected = true;
      this.selectedItems.push(item);
    }
    this.selectedData.emit(this.selectedItems);

  }


  public selectItem(item: any): void {
    if (item.text) {
      this.searchTerm = item.text;
      this.isDropdownOpen = false;
    }
  }
}
