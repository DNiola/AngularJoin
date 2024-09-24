import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-contact-card',
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.scss'],
})
export class ContactCardComponent  implements OnInit {
@Output() closeCard = new EventEmitter<void>();

  public isEditContact = false;

  constructor() { }

  ngOnInit() {}


  onCloseCard() {
    this.closeCard.emit();
  }
}
