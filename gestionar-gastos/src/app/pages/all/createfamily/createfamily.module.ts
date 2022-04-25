import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatefamilyPageRoutingModule } from './createfamily-routing.module';

import { CreatefamilyPage } from './createfamily.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatefamilyPageRoutingModule
  ],
  declarations: [CreatefamilyPage]
})
export class CreatefamilyPageModule {}
