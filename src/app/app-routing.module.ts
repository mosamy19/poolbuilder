import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: localStorage.getItem("account")?'projects':'login', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'projects',
    loadChildren: () => import('./projects/projects-list/projects-list.module').then( m => m.ProjectsListPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'add-project',
    loadChildren: () => import('./projects/add-project/add-project.module').then( m => m.AddProjectPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'project-details/:id',
    loadChildren: () => import('./projects/project-details/project-details.module').then( m => m.ProjectDetailsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'add-task/:projectId',
    loadChildren: () => import('./tasks/add-task/add-task.module').then( m => m.AddTaskPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'task-details/:id',
    loadChildren: () => import('./tasks/task-details/task-details.module').then( m => m.TaskDetailsPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./sign-up/sign-up.module').then( m => m.SignUpPageModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
