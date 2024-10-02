import { Component, ElementRef, EventEmitter, HostListener, Input, Output, SimpleChanges } from '@angular/core';
import { Category } from 'src/app/models/category.model';

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

  @Input() editValueMode? = '' as any;

  @Output() outputValue = new EventEmitter<Array<any>>();

  public filteredItems: any[] = [];
  public isDropdownOpen = false;
  public selectedItems: Array<any> = [];
  public searchTerm = '';

constructor(private eRef: ElementRef) { }

  ngOnInit() {
    if (this.editValueMode[0]?.text) {
      this.searchTerm = this.editValueMode[0].text;
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


  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if (this.isDropdownOpen && !this.eRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }
}
