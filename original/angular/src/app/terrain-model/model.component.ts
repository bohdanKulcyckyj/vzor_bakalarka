import { Component, ElementRef, Input, NgZone, ViewChild } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { IModelOptions, Model } from './model';
// import { OrbitControls } from './OrbitControls';
import CameraControls from 'camera-controls';

@Component({
	selector: 'app-terrain-model',
	template: `
		<div class="model-wrapper" #wrapper>
			<canvas #canvas width="1500" height="700" (click)="click($event)" (mousemove)="move($event)" (mousedown)="down($event)"></canvas>
			<div #viewHelperCanvasWrapper class="axis-control" style="width: 128px; height: 128px;"></div>
			<div #northArrowCanvasWrapper class="north-arrow-control" style="width: 128px; height: 128px;"></div>
		</div>
	`,
	styleUrls: ['./model.component.less']
})
export class TerrainModelComponent {

	@ViewChild('wrapper', { static: true })
	public wrapper: ElementRef<HTMLElement>;

	@ViewChild('canvas', { static: true })
	public canvas: ElementRef<HTMLCanvasElement>;

	@ViewChild('viewHelperCanvasWrapper', { static: true })
	public viewHelperCanvasWrapper: ElementRef<HTMLElement>;

	@ViewChild('northArrowCanvasWrapper', { static: true })
	public northArrowCanvasWrapper: ElementRef<HTMLElement>;

	@Input()
	public options: IModelOptions;

	private model: Model;

	constructor(private configService: ConfigService, private ngZone: NgZone) {
	}

	public ngOnInit() {

		const model = new Model(
			this.canvas.nativeElement,
			this.viewHelperCanvasWrapper.nativeElement, this.northArrowCanvasWrapper.nativeElement,
			this.options
		);

		this.ngZone.runOutsideAngular(() => {
			model.animate();
		});

		this.model = model;


		const controls: CameraControls = model.controls;
		window.addEventListener('keydown', (e) => {

			const keyRotateSpeed = 0.5;
			const keyRotateAngle = keyRotateSpeed * Math.PI / 180;


			if (e.shiftKey) {

				switch (e.keyCode) {
					case 37:  // LEFT
						controls.rotate(-keyRotateAngle, 0);
						break;
					case 38:  // UP
						controls.rotate(0, keyRotateAngle);
						break;
					case 39:  // RIGHT
						controls.rotate(keyRotateAngle, 0);
						break;
					case 40:  // DOWN
						controls.rotate(0, -keyRotateAngle);
						break;
					case 82:  // Shift + R
						controls.reset();
						break;
					default:
						return;
				}

			}
			else if (e.ctrlKey) {
				switch (e.keyCode) {
					case 37:  // Ctrl + LEFT
						this.model.cameraRotate(keyRotateAngle, 0);
						break;
					case 38:  // Ctrl + UP
						this.model.cameraRotate(0, keyRotateAngle);
						break;
					case 39:  // Ctrl + RIGHT
						this.model.cameraRotate(-keyRotateAngle, 0);
						break;
					case 40:  // Ctrl + DOWN
						this.model.cameraRotate(0, -keyRotateAngle);
						break;
					default:
						return;
				}
			}
			else {
				const keyPanSpeed = 0.2;

				switch (e.keyCode) {
					case 37:  // LEFT
						controls.truck(-keyPanSpeed, 0, true);    // horizontally left
						break;
					case 38:  // UP
						controls.forward(keyPanSpeed, true);    // horizontally forward
						break;
					case 39:  // RIGHT
						controls.truck(keyPanSpeed, 0, true);
						break;
					case 40:  // DOWN
						controls.forward(-keyPanSpeed, true);
						break;
					default:
						return;
				}
			}
		});


		const resize = () => {
			this.model.resize(
				this.wrapper.nativeElement.offsetWidth,
				this.wrapper.nativeElement.offsetHeight
			);
		};

		const resizeObserver = new ResizeObserver((entries) => {
			resize();
		});
		resizeObserver.observe(this.wrapper.nativeElement);


		// ---



		this.configService.config.subscribe(x => {
			model.setAnimateTrail(x.animateTrail);
			model.setEnableShadow(x.enableShadow);
			model.setEnableSun(x.enableSun);
			console.log(x);
		});
	}




	public move(e: MouseEvent) {

	}


	private downPos: { x: number; y: number; }
	public down(e: MouseEvent) {
		this.downPos = {
			x: e.clientX,
			y: e.clientY
		}
	}

	public click(e: MouseEvent) {
		if (this.downPos.x != e.clientX || this.downPos.y != e.clientY) {
			return;
		}
		this.model.click(e);
	}

	public resetCamera() {
		this.model.resetCamera();
	}
}
