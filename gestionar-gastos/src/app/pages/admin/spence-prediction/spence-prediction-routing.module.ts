import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpencePredictionPage } from './spence-prediction.page';

const routes: Routes = [
  {
    path: '',
    component: SpencePredictionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpencePredictionPageRoutingModule {}
