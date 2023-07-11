import { NgModule } from "@angular/core";
import { ProjectsComponent } from "./projects.component";
import { RouterModule, Routes } from "@angular/router";
import { CommonModule } from "@angular/common";


const routes: Routes = [
    {
        path: '',
        component: ProjectsComponent,
        pathMatch: 'full'
    }
];



@NgModule({
    declarations: [ProjectsComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ]
})
export class ProjectsModule {

}