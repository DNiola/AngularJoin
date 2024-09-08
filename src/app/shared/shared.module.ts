import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthFormComponent } from '../components/auth-form/auth-form.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AuthHeaderComponent } from '../components/auth-header/auth-header.component';
import { RouterModule } from '@angular/router';
import { AuthInputFieldsComponent } from '../components/auth-input-fields/auth-input-fields.component';
import { AuthCheckboxComponent } from '../components/auth-checkbox/auth-checkbox.component';
@NgModule({
  declarations: [AuthFormComponent, AuthHeaderComponent, AuthInputFieldsComponent, AuthCheckboxComponent],
  imports: [CommonModule, IonicModule, FormsModule, RouterModule],
  exports: [AuthFormComponent, AuthHeaderComponent, AuthInputFieldsComponent, AuthCheckboxComponent]
})
export class SharedModule { }
