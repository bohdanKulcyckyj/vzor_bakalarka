export interface ILatLng {
    lat: number;
    lng: number;
}

export interface ILatLngAlt extends ILatLng {
    alt: number;
}

export interface IPoint {
    x: number;
    y: number;
}

export interface IPoint3D extends IPoint {
    z: number;
}