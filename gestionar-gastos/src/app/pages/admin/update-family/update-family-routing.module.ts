import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateFamilyPage } from './update-family.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateFamilyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateFamilyPageRoutingModule {}
