/*
 * Spherical Mercator projection — the most common projection for online maps,
 * used by almost all free and commercial tile providers. Assumes that Earth is
 * a sphere. Used by the `EPSG:3857` CRS.
 */

import { ILatLng, IPoint } from "./interfaces";

const earthRadius = 6378137;

export class SphericalMercator {

    static readonly R = earthRadius;
    readonly MAX_LATITUDE = 85.0511287798;

    project(latlng: ILatLng): IPoint {
        const d = Math.PI / 180,
            max = this.MAX_LATITUDE,
            lat = Math.max(Math.min(max, latlng.lat), -max),
            sin = Math.sin(lat * d);

        return {
            x: SphericalMercator.R * latlng.lng * d,
            y: SphericalMercator.R * Math.log((1 + sin) / (1 - sin)) / 2
        };
    }

    unproject(point: IPoint): ILatLng {
        const d = 180 / Math.PI;

        return {
            lat: (2 * Math.atan(Math.exp(point.y / SphericalMercator.R)) - (Math.PI / 2)) * d,
            lng: point.x * d / SphericalMercator.R
        };
    }
    /*
        bounds: (function () {
            const d = earthRadius * Math.PI;
            return new Bounds([-d, -d], [d, d]);
        })()
        */
}