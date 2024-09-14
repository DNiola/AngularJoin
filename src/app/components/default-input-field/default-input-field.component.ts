import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-default-input-field',
  templateUrl: './default-input-field.component.html',
  styleUrls: ['./default-input-field.component.scss'],
})

export class DefaultInputFieldComponent implements OnInit {
  @Input() fieldRequired = false;
  @Input() label = '';
  @Input() items: any[] = [];
  @Input() dropDown = false;
  @Input() placeholder = '';
  @Input() type = '';
 
  public selectedItems: Array<any> = [];
  public searchTerm = '';
  public isDropdownOpen = false;
  public filteredItems: any[] = [];
 
  public isSubtask = false;
  constructor() { }

  ngOnInit() {
    this.filteredItems = [...this.items];
  }


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
      this.isSubtask = true;
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
  }


  public selectItem(item: any): void {
    if (item.text) {
      this.searchTerm = item.text;
      this.isDropdownOpen = false;
    }

  }
}
