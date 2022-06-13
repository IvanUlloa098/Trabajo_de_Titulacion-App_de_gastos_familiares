import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReporteGastosPage } from './reporte-gastos.page';

const routes: Routes = [
  {
    path: '',
    component: ReporteGastosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReporteGastosPageRoutingModule {}
