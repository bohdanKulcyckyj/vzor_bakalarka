import { ILatLng, IPoint } from './interfaces';
import { SphericalMercator } from './SphericalMercator ';
import { Transformation } from './Transformation';


export class Map {
	constructor(public readonly center: ILatLng, public readonly centerAltitude: number, public readonly zoom: number) {
	}


	public getTileWidthInMeters() {
		const tileRes = 156543.03 * Math.cos(this.center.lat / 180 * Math.PI) / Math.pow(2, this.zoom) * 256;
		return tileRes;
	}

	public project(coord: ILatLng): IPoint {
		const projection = new SphericalMercator();
		const tran = Transformation.create();

		const scale = 256 * Math.pow(2, this.zoom);

		return tran.transform(projection.project(coord), scale);
	}

	public unproject(point: IPoint): ILatLng {
		const projection = new SphericalMercator();
		const tran = Transformation.create();

		const scale = 256 * Math.pow(2, this.zoom);

		return projection.unproject(tran.untransform(point, scale));
	}
}
