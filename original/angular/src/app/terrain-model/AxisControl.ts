import { WebGLRenderer, Camera, Clock } from 'three';
import { ViewHelper } from './ViewHelper';
import { Model } from './model';


export class AxisControl {

	private viewHelper: ViewHelper;

	private renderer: WebGLRenderer;

	private clock = new Clock();

	constructor(model: Model, camera: Camera, container: HTMLElement) {
		//container.style.display = "block";

		const renderer = new WebGLRenderer({ alpha: true, antialias: true });
		renderer.setClearColor(0, 0);
		renderer.setSize(container.clientWidth, container.clientHeight);

		container.appendChild(renderer.domElement);

		this.renderer = renderer;
		this.viewHelper = new ViewHelper(camera, container);

		container.addEventListener('pointerup', (event) => {
			event.stopPropagation();
			this.viewHelper.handleClick(event);
		});

		// this.viewHelper.controls = controls;
		this.viewHelper.addEventListener("requestAnimation", (event) => {
			this.clock.start();
			// requestAnimationFrame(() => model.animate());
		});

	}

	public render() {
		this.viewHelper.render(this.renderer);
	}

	public update() {
		if (this.viewHelper.animating) {
			this.viewHelper.update(this.clock.getDelta());
		}
	}

}
