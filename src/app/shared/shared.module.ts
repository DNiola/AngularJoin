import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthFormComponent } from '../components/auth-form/auth-form.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AuthHeaderComponent } from '../components/auth-header/auth-header.component';
import { RouterModule } from '@angular/router';
import { AuthInputFieldsComponent } from '../components/auth-input-fields/auth-input-fields.component';
import { AuthCheckboxComponent } from '../components/auth-checkbox/auth-checkbox.component';
import { AuthFooterComponent } from '../components/auth-footer/auth-footer.component';
import { ButtonFilledComponent } from '../components/button-filled/button-filled.component';
import { ButtonEdgeComponent } from '../components/button-edge/button-edge.component';
import { HeaderComponent } from '../components/header/header.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
@NgModule({
  declarations: [SidebarComponent, HeaderComponent, AuthFormComponent, AuthHeaderComponent, AuthInputFieldsComponent, AuthCheckboxComponent, AuthFooterComponent, ButtonFilledComponent, ButtonEdgeComponent],
  imports: [CommonModule, IonicModule, FormsModule, RouterModule],
  exports: [SidebarComponent, HeaderComponent, AuthFormComponent, AuthHeaderComponent, AuthInputFieldsComponent, AuthCheckboxComponent, AuthFooterComponent, ButtonFilledComponent, ButtonEdgeComponent]
})
export class SharedModule { }
