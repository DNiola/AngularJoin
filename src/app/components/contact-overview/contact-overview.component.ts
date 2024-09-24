import { Component, Input, OnInit } from '@angular/core';
import { Contact } from 'src/app/models/contact.model';

@Component({
  selector: 'app-contact-overview',
  templateUrl: './contact-overview.component.html',
  styleUrls: ['./contact-overview.component.scss'],
})
export class ContactOverviewComponent  implements OnInit {
  @Input() selectedContact: Contact | null = null;

  constructor() { }

  ngOnInit() {}

}
