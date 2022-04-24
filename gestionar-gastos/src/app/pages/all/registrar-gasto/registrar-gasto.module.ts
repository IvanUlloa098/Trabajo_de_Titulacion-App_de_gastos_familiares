import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrarGastoPageRoutingModule } from './registrar-gasto-routing.module';

import { RegistrarGastoPage } from './registrar-gasto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrarGastoPageRoutingModule
  ],
  declarations: [RegistrarGastoPage]
})
export class RegistrarGastoPageModule {}
