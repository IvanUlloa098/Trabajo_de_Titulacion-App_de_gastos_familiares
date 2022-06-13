import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReporteGastosAdminPageRoutingModule } from './reporte-gastos-admin-routing.module';

import { ReporteGastosAdminPage } from './reporte-gastos-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReporteGastosAdminPageRoutingModule
  ],
  declarations: [ReporteGastosAdminPage]
})
export class ReporteGastosAdminPageModule {}
