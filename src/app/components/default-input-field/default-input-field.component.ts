import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

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

  @Input() resetTrigger = false;

  @Output() outputValue = new EventEmitter<string>();

  public inputValue: string = '';

  public onInputChange(event: any): void {
    this.inputValue = event.target.value;
    this.outputValue.emit(this.inputValue);
  }
  
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['resetTrigger']) {
      this.clearDropdown();
    }
  }


  private clearDropdown(): void {
    this.inputValue = '';
  }

}
