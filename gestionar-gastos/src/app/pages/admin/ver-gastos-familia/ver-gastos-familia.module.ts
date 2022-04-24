import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerGastosFamiliaPageRoutingModule } from './ver-gastos-familia-routing.module';

import { VerGastosFamiliaPage } from './ver-gastos-familia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerGastosFamiliaPageRoutingModule
  ],
  declarations: [VerGastosFamiliaPage]
})
export class VerGastosFamiliaPageModule {}
