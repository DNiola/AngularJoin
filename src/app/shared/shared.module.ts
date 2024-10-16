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
import { UserBubbleComponent } from '../components/user-bubble/user-bubble.component';
import { CreatorInputFieldComponent } from '../components/creator-input-field/creator-input-field.component';
import { SubtaskListComponent } from '../components/subtask-list/subtask-list.component';
import { BigTitleComponent } from '../components/big-title/big-title.component';
import { TaskCardComponent } from '../components/task-card/task-card.component';
import { BoardSectionComponent } from '../components/board-section/board-section.component';
import { TaskCardAddComponent } from '../components/task-card-add/task-card-add.component';
import { PageTitleComponent } from '../components/page-title/page-title.component';
import { SearchInputFieldComponent } from '../components/search-input-field/search-input-field.component';
import { TaskCardOverviewComponent } from '../components/task-card-overview/task-card-overview.component';
import { ContactItemComponent } from '../components/contact-item/contact-item.component';
import { ContactOverviewComponent } from '../components/contact-overview/contact-overview.component';
import { ContactCardComponent } from '../components/contact-card/contact-card.component';
import { DialogComponent } from '../components/dialog/dialog.component';
import { AnimatedBadgeComponent } from '../components/animated-badge/animated-badge.component';
import { DropdownInputFieldSingleSelectComponent } from '../components/dropdown-input-field-single-select/dropdown-input-field-single-select.component';
import { DropdownInputFieldMultiSelectComponent } from '../components/dropdown-input-field-multi-select/dropdown-input-field-multi-select.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
@NgModule({
  declarations: [DropdownInputFieldMultiSelectComponent, DropdownInputFieldSingleSelectComponent, AnimatedBadgeComponent, DialogComponent, ContactCardComponent, ContactOverviewComponent, ContactItemComponent, TaskCardOverviewComponent, SearchInputFieldComponent, PageTitleComponent, TaskCardAddComponent, BoardSectionComponent, TaskCardComponent, BigTitleComponent, SubtaskListComponent, CreatorInputFieldComponent, DropdownInputFieldMultiSelectComponent, UserBubbleComponent, PrioButtonComponent, DefaultInputFieldComponent, FilterPipe, OverviewBoxComponent, SidebarButtonComponent, SidebarComponent, HeaderComponent, AuthFormComponent, AuthHeaderComponent, AuthInputFieldsComponent, AuthCheckboxComponent, AuthFooterComponent, ButtonFilledComponent, ButtonEdgeComponent],
  imports: [CommonModule, IonicModule, FormsModule, RouterModule, DragDropModule],
  exports: [DropdownInputFieldMultiSelectComponent, DropdownInputFieldSingleSelectComponent, AnimatedBadgeComponent, DialogComponent, ContactCardComponent, ContactOverviewComponent, ContactItemComponent, TaskCardOverviewComponent, SearchInputFieldComponent, PageTitleComponent, TaskCardAddComponent, BoardSectionComponent, TaskCardComponent, BigTitleComponent, SubtaskListComponent, CreatorInputFieldComponent, DropdownInputFieldMultiSelectComponent, UserBubbleComponent, PrioButtonComponent, DefaultInputFieldComponent, FilterPipe, OverviewBoxComponent, SidebarButtonComponent, SidebarComponent, HeaderComponent, AuthFormComponent, AuthHeaderComponent, AuthInputFieldsComponent, AuthCheckboxComponent, AuthFooterComponent, ButtonFilledComponent, ButtonEdgeComponent]
})
export class SharedModule { }
