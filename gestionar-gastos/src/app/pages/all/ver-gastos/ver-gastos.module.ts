import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerGastosPageRoutingModule } from './ver-gastos-routing.module';

import { VerGastosPage } from './ver-gastos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerGastosPageRoutingModule
  ],
  declarations: [VerGastosPage]
})
export class VerGastosPageModule {}
