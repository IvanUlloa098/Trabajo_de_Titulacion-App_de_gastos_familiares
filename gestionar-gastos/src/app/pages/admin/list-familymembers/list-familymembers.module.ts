import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListFamilymembersPageRoutingModule } from './list-familymembers-routing.module';

import { ListFamilymembersPage } from './list-familymembers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListFamilymembersPageRoutingModule
  ],
  declarations: [ListFamilymembersPage]
})
export class ListFamilymembersPageModule {}
