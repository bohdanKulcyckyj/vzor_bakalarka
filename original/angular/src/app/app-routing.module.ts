import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./projects/projects.module').then(x => x.ProjectsModule),
    pathMatch: 'full'
  },
  {
    path: 'project/:projectId',
    loadChildren: () => import('./project/project.module').then(x => x.ProjectModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
