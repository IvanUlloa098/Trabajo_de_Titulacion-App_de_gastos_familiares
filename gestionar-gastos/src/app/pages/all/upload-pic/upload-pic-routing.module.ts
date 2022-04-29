import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadPicPage } from './upload-pic.page';

const routes: Routes = [
  {
    path: '',
    component: UploadPicPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadPicPageRoutingModule {}
