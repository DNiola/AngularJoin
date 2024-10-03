import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.page.html',
  styleUrls: ['./policy.page.scss'],
})
export class PolicyPage {

  constructor(private location: Location) { }

  public goBack(): void {
    this.location.back();
  }


}
