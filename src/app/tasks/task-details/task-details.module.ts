import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskDetailsPageRoutingModule } from './task-details-routing.module';

import { TaskDetailsPage } from './task-details.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MomentModule } from 'ngx-moment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskDetailsPageRoutingModule,
    FontAwesomeModule,
    MomentModule
  ],
  declarations: [TaskDetailsPage]
})
export class TaskDetailsPageModule {}
