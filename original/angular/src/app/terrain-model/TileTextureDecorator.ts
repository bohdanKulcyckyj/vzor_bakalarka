import { Texture } from 'three';
import { ILatLngAlt, IPoint } from './interfaces';
import { Map } from './Map';

export interface ITileTextureDecorator {
	decorate(texture: Texture, tileLat: number, tileLng: number): void;
}

export class TileTextureDecorator implements ITileTextureDecorator {
	private projectedTrail: IPoint[];

	constructor(private trail: ILatLngAlt[], private map: Map) {
		this.projectedTrail = trail.map(x => this.map.project({
			lat: x.lat,
			lng: x.lng
		}));
	}

	public decorate(texture: Texture, tileLat: number, tileLng: number) {
		const origin = this.map.project({
			lat: tileLat,
			lng: tileLng
		});

		this.drawTrailIntoTexture(this.projectedTrail, texture, origin);
	}

	private drawTrailIntoTexture(projectedTrail: IPoint[], texture: Texture, origin: IPoint) {

		let img = texture.source.data as HTMLImageElement;
		let canvas = document.createElement('canvas');
		canvas.width = img.width;
		canvas.height = img.height;
		let ctx = canvas.getContext('2d');

		ctx.strokeStyle = 'red';
		ctx.lineWidth = 6;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.drawImage(img, 0, 0);

		ctx.beginPath();

		let idx = 0;
		for (let tmpPoint of projectedTrail) {

			const coordX = (tmpPoint.x - origin.x) * 2;
			const coordY = -(origin.y - tmpPoint.y) * 2;

			if (idx == 0) {
				ctx.moveTo(coordX, coordY);
			} else {
				ctx.lineTo(coordX, coordY);
			}

			idx++;
		}

		ctx.stroke();

		texture.source.data = ctx.getImageData(0, 0, canvas.width, canvas.height);
	}
}
