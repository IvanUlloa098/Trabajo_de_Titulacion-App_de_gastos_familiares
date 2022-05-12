import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerPresupuestosPage } from './ver-presupuestos.page';

const routes: Routes = [
  {
    path: '',
    component: VerPresupuestosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerPresupuestosPageRoutingModule {}
