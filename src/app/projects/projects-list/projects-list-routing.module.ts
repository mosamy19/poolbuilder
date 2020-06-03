import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectsListPage } from './projects-list.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsListPageRoutingModule {}
