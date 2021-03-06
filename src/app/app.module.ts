import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// plugins
import { Camera } from '@ionic-native/camera/ngx';

// firebase
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { NewOwnerPageModule } from './new-owner/new-owner.module';
import { NewPetPageModule } from './new-pet/new-pet.module';
import { NewShedulePageModule } from './new-shedule/new-shedule.module';
import { ScheduleDetailPageModule  } from './schedule-detail/schedule-detail.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebase),
    NewOwnerPageModule,
    NewPetPageModule,
    NewShedulePageModule,
    ScheduleDetailPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireAuth,
    AngularFirestore,
    Camera,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
