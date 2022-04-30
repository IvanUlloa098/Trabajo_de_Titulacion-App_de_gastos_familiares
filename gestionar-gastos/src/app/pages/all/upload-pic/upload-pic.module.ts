import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadPicPageRoutingModule } from './upload-pic-routing.module';

import { UploadPicPage } from './upload-pic.page';

import { FileSizePipe } from './file-size.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UploadPicPageRoutingModule
  ],
  declarations: [UploadPicPage, FileSizePipe]
})
export class UploadPicPageModule {}
