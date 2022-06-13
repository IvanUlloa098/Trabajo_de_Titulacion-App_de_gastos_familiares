import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from 'src/environments/environment';
import { AngularFireStorage } from '@angular/fire/compat/storage'; 

import { GooglePlus } from '@ionic-native/google-plus/ngx';

import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';

import {NgChartsModule } from 'ng2-charts'

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, 
            IonicModule.forRoot(), 
            AngularFireModule.initializeApp(environment.firebaseConfig), 
            AngularFirestoreModule, 
            AngularFireAuthModule, 
            AngularFireStorageModule,
            NgChartsModule ,
            AppRoutingModule],
            
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, {provide: ErrorHandler}, GooglePlus, AngularFireStorage,LocalNotifications],
  bootstrap: [AppComponent],
})
export class AppModule {}
