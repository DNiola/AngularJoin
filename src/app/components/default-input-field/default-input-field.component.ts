import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { IonInput } from '@ionic/angular';

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
  @Input() editValueMode? = '';
  @Input() errorMessage = false;
  @Input() resetTrigger = false;

  @Output() outputValue = new EventEmitter<string>();

  public inputValue: string = '';
  public minDate = '';

  
  /**
   * Initializes the component by setting the minimum date value and populating the input field if in edit mode.
   *
   * @returns {void}
   */
  public ngOnInit(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);

    this.minDate = `${year}-${month}-${day}`;

    if (this.editValueMode) {
      this.inputValue = this.editValueMode;
    }
  }

  
  /**
   * Handles input change events and emits the updated value.
   *
   * @param {Event} event - The input event containing the new value.
   * @returns {void}
   */
  public onInputChange(event: any): void {
    this.inputValue = event.target.value;
    this.outputValue.emit(this.inputValue);
  }

  
  /**
   * Handles changes to component inputs, specifically for resetting the input field.
   *
   * @param {SimpleChanges} changes - Object containing the changed input properties.
   * @returns {void}
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['resetTrigger']) {
      this.clearDropdown();
    }
  }

  
  /**
   * Clears the current value of the input field.
   *
   * @returns {void}
   */
  private clearDropdown(): void {
    this.inputValue = '';
  }
}
