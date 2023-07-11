import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { SidePanelService } from './side-panel/side-panel.service';

@Component({
    selector: 'app-root',
    template: `
    <div class="main-container" [class.main-is-mobile]="mobileQuery.matches">

    <mat-toolbar color="primary">
        <button mat-icon-button (click)="openSideNav = !openSideNav" [style.visibility]="displayMenuBtn ? 'hidden' : null">
            <mat-icon>menu</mat-icon>
        </button>
        <span>3d mapa</span>
        <span class="flex-spacer"></span>
        
        <a mat-button [routerLink]="['/']">
            projekty
        </a>
        <!--
        <button mat-icon-button>
            <mat-icon>logout</mat-icon>
        </button>
        -->
    </mat-toolbar>

    <mat-sidenav-container class="main-sidenav-container">
        <mat-sidenav #snav class="mat-sidenav" [(opened)]="openSideNav && showSideNav" [mode]="mobileQuery.matches ? 'over' : 'side'" [fixedInViewport]="mobileQuery.matches" fixedTopGap="56">
            <app-side-panel></app-side-panel>
        </mat-sidenav>

        <mat-sidenav-content>
            <router-outlet></router-outlet>
        </mat-sidenav-content>
    </mat-sidenav-container>
  </div> 
  `,
    styleUrls: ['./app.component.less']
})
export class AppComponent {
    mobileQuery: MediaQueryList;

    public displayMenuBtn = true;

    private _mobileQueryListener: () => void;

    public openSideNav = false;
    public showSideNav = true;


    constructor(private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public sidePanelService: SidePanelService) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addEventListener('change', this._mobileQueryListener);

        this.openSideNav = !this.mobileQuery.matches;
    }

    public ngOnInit() {
        this.sidePanelService.$content.subscribe(x => {
            this.showSideNav = x != null;
            const tmp = !(x != null);
            if (tmp != this.displayMenuBtn) {
                this.displayMenuBtn = tmp;

                this.changeDetectorRef.detectChanges();
            }
        });
    }

}
