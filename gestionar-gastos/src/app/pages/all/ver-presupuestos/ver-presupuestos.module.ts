import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerPresupuestosPageRoutingModule } from './ver-presupuestos-routing.module';

import { VerPresupuestosPage } from './ver-presupuestos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerPresupuestosPageRoutingModule
  ],
  declarations: [VerPresupuestosPage]
})
export class VerPresupuestosPageModule {}
