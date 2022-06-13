import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpencePredictionPageRoutingModule } from './spence-prediction-routing.module';

import { SpencePredictionPage } from './spence-prediction.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpencePredictionPageRoutingModule
  ],
  declarations: [SpencePredictionPage]
})
export class SpencePredictionPageModule {}
