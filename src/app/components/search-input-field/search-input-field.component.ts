import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-search-input-field',
  templateUrl: './search-input-field.component.html',
  styleUrls: ['./search-input-field.component.scss'],
})
export class SearchInputFieldComponent {
  @Input() placeholder: string = '';

}
