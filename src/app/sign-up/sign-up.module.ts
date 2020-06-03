import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignUpPageRoutingModule } from './sign-up-routing.module';

import { SignUpPage } from './sign-up.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxDropzoneModule } from 'ngx-dropzone';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FontAwesomeModule,
    SignUpPageRoutingModule,
    NgxDropzoneModule
  ],
  
  declarations: [SignUpPage]
})
export class SignUpPageModule {}
