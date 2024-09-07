import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthFormComponent } from '../components/auth-form/auth-form.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [AuthFormComponent],
  imports: [CommonModule, IonicModule, FormsModule],
  exports: [AuthFormComponent]
})
export class SharedModule { }
