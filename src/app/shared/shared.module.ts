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
import { SidebarButtonComponent } from '../components/sidebar-button/sidebar-button.component';
import { OverviewBoxComponent } from '../components/overview-box/overview-box.component';
import { FilterPipe } from './pipes/filter.pipe';
import { DefaultInputFieldComponent } from '../components/default-input-field/default-input-field.component';
import { PrioButtonComponent } from '../components/prio-button/prio-button.component';
@NgModule({
  declarations: [PrioButtonComponent, DefaultInputFieldComponent, FilterPipe, OverviewBoxComponent, SidebarButtonComponent, SidebarComponent, HeaderComponent, AuthFormComponent, AuthHeaderComponent, AuthInputFieldsComponent, AuthCheckboxComponent, AuthFooterComponent, ButtonFilledComponent, ButtonEdgeComponent],
  imports: [CommonModule, IonicModule, FormsModule, RouterModule],
  exports: [PrioButtonComponent, DefaultInputFieldComponent, FilterPipe, OverviewBoxComponent, SidebarButtonComponent, SidebarComponent, HeaderComponent, AuthFormComponent, AuthHeaderComponent, AuthInputFieldsComponent, AuthCheckboxComponent, AuthFooterComponent, ButtonFilledComponent, ButtonEdgeComponent]
})
export class SharedModule { }
