import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerGastosFamiliaPage } from './ver-gastos-familia.page';

const routes: Routes = [
  {
    path: '',
    component: VerGastosFamiliaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerGastosFamiliaPageRoutingModule {}
