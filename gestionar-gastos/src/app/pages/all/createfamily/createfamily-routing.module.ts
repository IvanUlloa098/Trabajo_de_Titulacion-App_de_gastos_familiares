import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatefamilyPage } from './createfamily.page';

const routes: Routes = [
  {
    path: '',
    component: CreatefamilyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatefamilyPageRoutingModule {}
