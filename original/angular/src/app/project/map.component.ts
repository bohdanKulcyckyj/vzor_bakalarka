import { Component, ElementRef, NgZone, ViewChild } from "@angular/core";
import { Map, TileLayer, LatLngBounds } from 'leaflet';
import { AreaSelect } from "../leaflet/areaselect";
import { ProjectService } from "../services/project.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector: 'app-map',
    template: `
        <div id="map" #map></div>
        <div class="btns-wrapper">
            <div class="btn-wrapper">
                <button mat-fab color="accent" (click)="cancel()">
                    <mat-icon>close</mat-icon>
                </button>
            </div>
            <div class="btn-wrapper">
                <button mat-fab color="primary" (click)="confirm()">
                    <mat-icon>done</mat-icon>
                </button>
            </div>
        </div>
    `,
    styles: [
        '#map { height: calc(100vh - 64px); }',
        '.btns-wrapper { position: fixed; right: 20px; bottom: 20px; z-index: 1000; }',
        '.btn-wrapper { padding: 5px; }'
    ]
})
export class MapComponent {

    @ViewChild('map', {
        static: true
    })
    public mapEl: ElementRef<HTMLElement>;

    private areaSelect: any;

    public projectId: number = null;

    constructor(
        private projectService: ProjectService, private router: Router,
        private activatedRoute: ActivatedRoute, private snackBar: MatSnackBar,
        private zone: NgZone
    ) {

    }
    public ngOnInit() {
        let map: Map;

        this.activatedRoute.paramMap.subscribe(x => {
            this.projectId = +x.get('projectId');

            this.projectService.get(this.projectId).subscribe(y => {
                console.log(y.center);


                this.zone.runOutsideAngular(() => {
                    map.panTo(y.center);
                    if (y.bbox != null) {
                        this.areaSelect.setBounds(new LatLngBounds(y.bbox.southWest, y.bbox.northEast));
                    }
                });

            });
        });

        this.zone.runOutsideAngular(() => {
            map = new Map(this.mapEl.nativeElement)
                .setView([51.505, -0.09], 13);

            const layer = new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            });

            layer.addTo(map);

            this.areaSelect = new (AreaSelect as any)({
                width: 200,
                height: 300,
                minWidth: 40,
                minHeight: 40,
                minHorizontalSpacing: 40,
                minVerticalSpacing: 100
            });
            this.areaSelect.addTo(map);
        });

    }

    public confirm() {
        const bounds: LatLngBounds = this.areaSelect.getBounds();
        console.log(bounds);

        var dist = bounds.getNorthEast().distanceTo(bounds.getSouthWest());
        console.log('dist:', dist);

        if (dist > 20000 * 2) {
            this.snackBar.open('Plocha je příliš velká!');
            return;
        }

        this.projectService.setBBox(this.projectId, {
            northEast: bounds.getNorthEast(),
            southWest: bounds.getSouthWest()
        }).subscribe(() => {
            this.router.navigate(['/project', this.projectId]);
        });
    }

    public cancel() {
        this.router.navigate(['/project', this.projectId]);
    }
}