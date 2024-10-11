import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Contact } from 'src/app/models/contact.model';

@Component({
  selector: 'app-dropdown-input-field-multi-select',
  templateUrl: './dropdown-input-field-multi-select.component.html',
  styleUrls: ['./dropdown-input-field-multi-select.component.scss'],
})
export class DropdownInputFieldMultiSelectComponent implements OnInit {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() items: any[] = [];
  @Input() editValueMode = [] as any;
  @Input() resetTrigger = false;

  @Output() outputValue = new EventEmitter<Array<any>>();

  public searchTerm = '';
  public filteredItems: any[] = [];
  public selectedItems: Array<any> = [];
  public isDropdownOpen = false;

  constructor(private eRef: ElementRef) { }


  public ngOnInit(): void {
    if (this.editValueMode && this.editValueMode.length) {
      this.items.forEach(item => item.selected = false);
      this.items.forEach(item => {
        const editItem = this.editValueMode?.find((edit: any) => edit.userId === item.userId);
        if (editItem) {
          item.selected = editItem.selected;
        }
      });
      this.filteredItems = [...this.items];
      this.selectedItems = this.filteredItems.filter(item => item.selected);
    }
  }


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
  }


  public filterItems(): void {
    this.filteredItems = this.items.filter(item =>
      (item.name?.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
    if (this.searchTerm) {
      this.isDropdownOpen = true;
    }
  }


  public onToggleItem(item: Contact): void {
    if (item.selected) {
      item.selected = false;
      this.selectedItems = this.selectedItems.filter(selected => selected !== item);
    } else {
      item.selected = true;
      this.selectedItems.push(item);
    }
    this.outputValue.emit(this.selectedItems);
  }


  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (this.isDropdownOpen && !this.eRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }

  }
}