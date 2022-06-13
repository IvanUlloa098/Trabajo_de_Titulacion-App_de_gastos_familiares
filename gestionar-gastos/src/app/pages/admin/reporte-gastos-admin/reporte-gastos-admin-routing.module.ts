import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReporteGastosAdminPage } from './reporte-gastos-admin.page';

const routes: Routes = [
  {
    path: '',
    component: ReporteGastosAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReporteGastosAdminPageRoutingModule {}
