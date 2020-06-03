import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectsListPageRoutingModule } from './projects-list-routing.module';

import { ProjectsListPage } from './projects-list.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProjectsListPageRoutingModule,
    FontAwesomeModule
  ],
  declarations: [ProjectsListPage]
})
export class ProjectsListPageModule {}
