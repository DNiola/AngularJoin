import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

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

  @Input() errorMessage = false;
  @Input() resetTrigger = false;

  @Output() outputValue = new EventEmitter<Array<any>>();

  public filteredItems: any[] = [];
  public isDropdownOpen = false;
  public selectedItems: Array<any> = [];
  public searchTerm = '';


  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['resetTrigger']) {
      this.clearDropdown();
    }
  }


  private clearDropdown(): void {
    this.selectedItems = [];
    this.searchTerm = '';
    this.items.forEach(item => item.selected = false);
  }


  public toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.filterItems();
    }
    if (this.searchTerm) {
      this.isDropdownOpen = true;
    }
    if (!this.searchTerm && this.isDropdownOpen === false && this.fieldRequired) {
      this.errorMessage = true;
      this.selectedItems = [];
      this.outputValue.emit(this.selectedItems);
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
    this.outputValue.emit(this.selectedItems);
  }


  public selectItem(item: any): void {
    if (item.text) {
      this.searchTerm = item.text;
      this.isDropdownOpen = false;
    }
  }
}
