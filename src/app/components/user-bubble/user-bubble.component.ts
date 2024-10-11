import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-bubble',
  templateUrl: './user-bubble.component.html',
  styleUrls: ['./user-bubble.component.scss'],
})
export class UserBubbleComponent {

  @Input() color: string | undefined = 'gray';
  @Input() text: string | undefined = 'X X';
  @Input() size: string = '48px';
  @Input() borderWidth: string = '2px';
  @Input() borderColor: string = '';
  @Input() fontSize: string = '14px';

  
  /**
   * Returns the style object for the bubble element.
   * 
   * This method constructs an object containing the CSS styles for the user bubble, 
   * including background color, border color, size, border width, and font size.
   * 
   * @returns { { [key: string]: string } } An object representing the styles for the user bubble.
   */
  public get bubbleStyles(): { [key: string]: string } {
    return {
      'background-color': this.color ?? 'gray',
      'border-color': this.borderColor ?? '',
      'width': this.size,
      'height': this.size,
      'border-width': this.borderWidth,
      'font-size': this.fontSize
    };
  }

}