import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrarPresupuestosPage } from './registrar-presupuestos.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrarPresupuestosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrarPresupuestosPageRoutingModule {}
