import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthData } from 'src/app/models/user.model';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  public dialogMessage = {
    title: 'Attention !',
    message: 'Please do not use real credentials to log in to this site. This site was created for educational and training purposes and the security of the data cannot be fully guaranteed. Please also note that all data stored on this site can only be deleted manually by the administrators. For more information, please see our legal notice.',
  };

  public isError = false;
  public showAgain = false
  public isLoading = false;
  public isAnimation = false;
  public emptyInputFields = false;

  public isDialogOpen = true;
  public isSingUpSection = true

  public firebaseErrorPhat = '';

  constructor(private firestore: AngularFirestore, private router: Router, public helperService: HelperService, private afAuth: AngularFireAuth) { }


  public ngOnInit(): void {
    const disclaimerUnderstood = localStorage.getItem('disclaimerUnderstood');
    if (disclaimerUnderstood) {
      this.isDialogOpen = localStorage.getItem('disclaimerUnderstood') !== 'true';
    }
  }


  public async onSignUp(userData: AuthData) {
    this.isLoading = true;
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(userData.email, userData.password);
      const userId = result.user?.uid;

      const initials = this.helperService.getInitials(userData.name as string);
      const color = this.helperService.getRandomColor();

      await this.saveUserToFirestore(userId, userData.name as string, userData.email, initials, color);

      this.isAnimation = true;
      setTimeout(() => {
        this.isLoading = false;
        this.emptyInputFields = true;
        this.router.navigate(['/login']);
      }, 1000);
    }
    catch (error) {
      this.isLoading = false;
      this.firebaseErrorPhat = error as string;
      return;
    }
  }


  private saveUserToFirestore(userId: string | undefined, name: string, email: string, initials: string, color: string): Promise<void> {
    return this.firestore.collection('users').doc(userId).set({
      userId: userId,
      name: name,
      email: email,
      initials: initials,
      color: color
    });
  }
}
