import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  @Input() public dialogMessage = { title: '', message: '' };
  @Input() public showAgain = false;
  @Input() public isSingUpSection = false;

  @Output() public confirm = new EventEmitter<void>();
  @Output() public cancel = new EventEmitter<void>();

  
  /**
   * Handles the confirmation action by saving user preference and emitting the confirm event.
   *
   * @returns {void}
   */
  public onConfirm(): void {
    if (this.showAgain) {
      localStorage.setItem('disclaimerUnderstood', 'true');
    }
    this.confirm.emit();
  }

  
  /**
   * Handles the cancel action by emitting the cancel event.
   *
   * @returns {void}
   */
  public onCancel(): void {
    this.cancel.emit();
  }

  
  /**
   * Updates the "showAgain" property based on the checkbox state.
   *
   * @param {boolean} checked - The state of the checkbox.
   * @returns {void}
   */
  public onCheckboxChange(checked: boolean): void {
    this.showAgain = checked;
  }
}