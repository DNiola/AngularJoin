import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-auth-header',
  templateUrl: './auth-header.component.html',
  styleUrls: ['./auth-header.component.scss'],
})
export class AuthHeaderComponent {
  @Input() isLogin = false;

  public isAnimationComplete = false;

  onAnimationEnd() {
    this.isAnimationComplete = true;
    this.isAnimationComplete = false;
  }

}
