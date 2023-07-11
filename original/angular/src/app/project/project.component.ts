import { Component, TemplateRef, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ConfigService } from "../services/config.service";
import { SidePanelService } from "../side-panel/side-panel.service";
import { ProjectService } from "../services/project.service";
import { ActivatedRoute, RouterState } from "@angular/router";
import { IModelOptions } from "../terrain-model/model";
import { TerrainModelComponent } from "../terrain-model/model.component";

@Component({
    selector: 'app-project',
    template: `
    <ng-template #sidePanelTmpl>

        <mat-action-list role="list">
            <a mat-list-item [routerLink]="['./map']">
                <mat-icon matListItemIcon>map</mat-icon>
                <div matListItemTitle>výběr oblasti</div>
            </a>
            <a mat-list-item (click)="model.resetCamera()">
                <mat-icon matListItemIcon>camera</mat-icon>
                <div matListItemTitle>reset kamery</div>
            </a>
        </mat-action-list>

        <form [formGroup]="form">
            <p>
                <mat-checkbox formControlName="animateTrail">Animovat trasu</mat-checkbox>
            </p>
            <p>
                <mat-checkbox formControlName="enableShadow">Stínování</mat-checkbox>
            </p>
            <p>
                <mat-checkbox formControlName="enableSun">Slunce</mat-checkbox>
            </p>
        </form>
    </ng-template>
    <app-terrain-model *ngIf="modelOptions != null" [options]="modelOptions" #model></app-terrain-model>
    `
})
export class ProjectComponent {

    @ViewChild('sidePanelTmpl', { static: true })
    public sidePanelTmpl: TemplateRef<any>;

    
    @ViewChild('model')
    public model: TerrainModelComponent;

    public modelOptions: IModelOptions = null;

    public form = new FormGroup({
        animateTrail: new FormControl<boolean>(false),
        enableShadow: new FormControl<boolean>(false),
        enableSun: new FormControl<boolean>(false)
    });

    constructor(
        private configService: ConfigService, public sidePanelService: SidePanelService, private projectService: ProjectService,
        private activatedRoute: ActivatedRoute
    ) {

        const x = configService.config.value;
        this.form.patchValue({
            animateTrail: x.animateTrail,
            enableShadow: x.enableShadow,
            enableSun: x.enableSun
        });

        this.form.valueChanges.subscribe(x => {
            configService.config.next({
                animateTrail: x.animateTrail,
                enableShadow: x.enableShadow,
                enableSun: x.enableSun
            });
        });
    }

    public ngOnInit() {
        this.sidePanelService.$content.next(this.sidePanelTmpl);

        this.activatedRoute.paramMap.subscribe(x => {
            this.projectService.get(+x.get('projectId')).subscribe(y => {
                console.log(y);
                this.modelOptions = y;
            });
        });
    }

    public ngOnDestroy() {
        this.sidePanelService.$content.next(null);
    }

}