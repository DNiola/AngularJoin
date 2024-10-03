import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage {

  constructor(private location: Location) { }

  public goBack(): void {
    this.location.back();
  }

}
