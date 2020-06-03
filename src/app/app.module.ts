import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth'
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { HttpClientModule } from '@angular/common/http';
import { AuthInterceptorProviders } from './auth/auth.interceptor';

const firebaseConfig = {
  apiKey: "AIzaSyD-MAtKXjdzopjRAVARY3YCFJyxl1R1kno",
  authDomain: "poolbuilder360-36e7d.firebaseapp.com",
  databaseURL: "https://poolbuilder360-36e7d.firebaseio.com",
  projectId: "poolbuilder360-36e7d",
  storageBucket: "poolbuilder360-36e7d.appspot.com",
  messagingSenderId: "645752018235",
  appId: "1:645752018235:web:57975f2848274ca792531e",
  measurementId: "G-KVX33TVTYG"
};
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    FontAwesomeModule,
    HttpClientModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
