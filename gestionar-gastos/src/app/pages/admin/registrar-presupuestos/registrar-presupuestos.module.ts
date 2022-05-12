import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrarPresupuestosPageRoutingModule } from './registrar-presupuestos-routing.module';

import { RegistrarPresupuestosPage } from './registrar-presupuestos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrarPresupuestosPageRoutingModule
  ],
  declarations: [RegistrarPresupuestosPage]
})
export class RegistrarPresupuestosPageModule {}
