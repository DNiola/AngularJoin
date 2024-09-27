import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  public isDialogOpen = true ;

  public dialogMessage = {
    title: 'Attention !',
    message: 'Please do not use real credentials to log in to this site. This site was created for educational and training purposes and the security of the data cannot be fully guaranteed. Please also note that all data stored on this site can only be deleted manually by the administrators. For more information, please see our legal notice.',
    showAgain: false,
    isSingUpSection: true
  };

  constructor() { }

  ngOnInit() {
    const disclaimerUnderstood = localStorage.getItem('disclaimerUnderstood');
    if (disclaimerUnderstood) {
      this.isDialogOpen = localStorage.getItem('disclaimerUnderstood') !== 'true';
    }
  }
}
