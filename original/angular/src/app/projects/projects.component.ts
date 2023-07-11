import { Component } from "@angular/core";
import { ProjectsService } from "../services/projects.service";

@Component({
    selector: 'app-projects',
    template: `
        <h1>Projekty</h1>
        <ul>
            <li *ngFor="let project of list">
                <a [routerLink]="['/project', project.id]">{{project.title}}</a>
            </li>
        </ul>
    `
})
export class ProjectsComponent {

    public list: any[] = [];

    constructor(private projectsService: ProjectsService) { }

    public ngOnInit() {
        this.projectsService.list().subscribe(x => {
            console.log(x);
            this.list = x;
        });
    }
}