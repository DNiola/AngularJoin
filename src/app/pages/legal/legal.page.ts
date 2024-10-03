import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-legal',
  templateUrl: './legal.page.html',
  styleUrls: ['./legal.page.scss'],
})
export class LegalPage {

  constructor(private location: Location) { }

  public goBack(): void {
    this.location.back();
  }

}
