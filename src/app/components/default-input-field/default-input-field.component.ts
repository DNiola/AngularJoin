import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-default-input-field',
  templateUrl: './default-input-field.component.html',
  styleUrls: ['./default-input-field.component.scss'],
})

export class DefaultInputFieldComponent {
  @Input() fieldRequired = false;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type = '';

  @Output() outputValue = new EventEmitter<string>();

  public inputValue: string = '';

  onInputChange(event: any): void {
    this.inputValue = event.target.value;
    this.outputValue.emit(this.inputValue);
  }

}
