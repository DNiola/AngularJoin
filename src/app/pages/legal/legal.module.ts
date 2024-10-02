import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LegalPageRoutingModule } from './legal-routing.module';

import { LegalPage } from './legal.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, 
    SharedModule,
    LegalPageRoutingModule
  ],
  declarations: [LegalPage]
})
export class LegalPageModule { }
