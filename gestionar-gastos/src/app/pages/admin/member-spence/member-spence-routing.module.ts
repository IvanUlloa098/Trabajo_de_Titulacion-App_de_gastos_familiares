import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemberSpencePage } from './member-spence.page';

const routes: Routes = [
  {
    path: '',
    component: MemberSpencePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemberSpencePageRoutingModule {}
