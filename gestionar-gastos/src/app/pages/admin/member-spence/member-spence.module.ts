import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MemberSpencePageRoutingModule } from './member-spence-routing.module';

import { MemberSpencePage } from './member-spence.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MemberSpencePageRoutingModule
  ],
  declarations: [MemberSpencePage]
})
export class MemberSpencePageModule {}
