import { IPoint } from './interfaces';
import { SphericalMercator } from './SphericalMercator ';


export class Transformation {

	constructor(private a: number, private b: number, private c: number, private d: number) {
	}

	public static create() {
		var scale = 0.5 / (Math.PI * SphericalMercator.R);
		return new Transformation(scale, 0.5, -scale, 0.5);
	}

	public transform(point: IPoint, scale: number): IPoint {
		scale = scale || 1;
		point.x = scale * (this.a * point.x + this.b);
		point.y = scale * (this.c * point.y + this.d);
		return point;
	}


	public untransform(point: IPoint, scale: number) {
		scale = scale || 1;
		return {
			x: (point.x / scale - this.b) / this.a,
			y: (point.y / scale - this.d) / this.c
		};
	}
}
