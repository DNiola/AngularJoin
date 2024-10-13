import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button-filled',
  templateUrl: './button-filled.component.html',
  styleUrls: ['./button-filled.component.scss'],
})
export class ButtonFilledComponent {
  @Input() text = '';
  @Input() iconName? = '';
  @Input() disabled = false;
  @Input() isLoading = false;
  @Input() roundButton = false;

  @Output() confirm = new EventEmitter<void>();

  public onConfirm(): void {
    this.confirm.emit();
  }

}
