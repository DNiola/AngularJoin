import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  @Input() public dialogMessage = { title: '', message: '', showAgain: false, isSingUpSection: false };

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();


  public onConfirm(): void {
    if (this.dialogMessage.showAgain == true) {
      localStorage.setItem('disclaimerUnderstood', 'true');
    }
    this.confirm.emit();
  }


  public onCancel(): void {
    this.cancel.emit();
  }


  public onCheckboxChange(checked: boolean): void {
    this.dialogMessage.showAgain = checked;
  }
}
