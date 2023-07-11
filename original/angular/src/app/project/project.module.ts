import { NgModule } from "@angular/core";
import { ProjectComponent } from "./project.component";
import { RouterModule, Routes } from "@angular/router";
import { TerrainModelModule } from "../terrain-model/terrain-model.module";
import { ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MapComponent } from "./map.component";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatListModule } from "@angular/material/list";

const routes: Routes = [
    {
        path: '',
        component: ProjectComponent,
        pathMatch: 'full'
    },
    {
        path: 'map',
        component: MapComponent
    }
];


@NgModule({
    declarations: [
        ProjectComponent,
        MapComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatListModule,
        TerrainModelModule,
        ReactiveFormsModule
    ]
})
export class ProjectModule {

}