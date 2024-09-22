import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-default-input-field',
  templateUrl: './default-input-field.component.html',
  styleUrls: ['./default-input-field.component.scss'],
})

export class DefaultInputFieldComponent implements OnInit {
  @Input() fieldRequired = false;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type = '';

  @Input() errorMessage = false;
  @Input() resetTrigger = false;


  @Input() editValueMode? = '';

  @Output() outputValue = new EventEmitter<string>();

  public inputValue: string = '';
  public minDate = '';

  ngOnInit() {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);

    this.minDate = `${year}-${month}-${day}`;

    if (this.editValueMode) {
      this.inputValue = this.editValueMode
    }
  }

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
