import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerGastosPage } from './ver-gastos.page';

const routes: Routes = [
  {
    path: '',
    component: VerGastosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerGastosPageRoutingModule {}
