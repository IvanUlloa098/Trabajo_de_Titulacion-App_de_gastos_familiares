import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListFamilymembersPage } from './list-familymembers.page';

const routes: Routes = [
  {
    path: '',
    component: ListFamilymembersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListFamilymembersPageRoutingModule {}
