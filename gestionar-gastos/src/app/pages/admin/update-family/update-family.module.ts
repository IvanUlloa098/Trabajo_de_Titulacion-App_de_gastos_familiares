import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateFamilyPageRoutingModule } from './update-family-routing.module';

import { UpdateFamilyPage } from './update-family.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UpdateFamilyPageRoutingModule
  ],
  declarations: [UpdateFamilyPage]
})
export class UpdateFamilyPageModule {}
