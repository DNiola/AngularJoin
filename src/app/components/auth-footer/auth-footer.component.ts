import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-footer',
  templateUrl: './auth-footer.component.html',
  styleUrls: ['./auth-footer.component.scss'],
})
export class AuthFooterComponent    {
@Input() leftFooter = false;
  

}
