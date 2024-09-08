import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthFormComponent } from '../components/auth-form/auth-form.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AuthHeaderComponent } from '../components/auth-header/auth-header.component';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [AuthFormComponent, AuthHeaderComponent],
  imports: [CommonModule, IonicModule, FormsModule, RouterModule],
  exports: [AuthFormComponent,AuthHeaderComponent]
})
export class SharedModule { }
