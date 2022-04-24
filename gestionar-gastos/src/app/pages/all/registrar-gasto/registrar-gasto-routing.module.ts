import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrarGastoPage } from './registrar-gasto.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrarGastoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrarGastoPageRoutingModule {}
