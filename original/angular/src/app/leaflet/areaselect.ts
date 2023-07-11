import { Class, Evented, Util, DomEvent, DomUtil, Map, Point, LatLngBounds } from 'leaflet';

export interface IOptions {
    width?: number;
    height?: number;
    minWidth?: number;
    minHeight?: number;
    minHorizontalSpacing?: number;
    minVerticalSpacing?: number;
    keepAspectRatio?: boolean;
}




const AreaSelect = Class.extend({
    includes: Evented.prototype,

    options: {
        width: 200,
        height: 300,
        minWidth: 30,
        minHeight: 30,
        minHorizontalSpacing: 30,
        minVerticalSpacing: 30,
        keepAspectRatio: false,
    } as IOptions,

    initialize: function (options: IOptions) {
        Util.setOptions(this, options);

        this._width = this.options.width;
        this._height = this.options.height;
    },

    addTo: function (map: Map) {
        this.map = map;
        this._createElements();
        this._render();
        return this;
    },

    getBounds: function () {
        var size = this.map.getSize();
        var topRight = new Point(0, 0);
        var bottomLeft = new Point(0, 0);

        bottomLeft.x = Math.round((size.x - this._width) / 2);
        topRight.y = Math.round((size.y - this._height) / 2);
        topRight.x = size.x - bottomLeft.x;
        bottomLeft.y = size.y - topRight.y;

        var sw = this.map.containerPointToLatLng(bottomLeft);
        var ne = this.map.containerPointToLatLng(topRight);

        return new LatLngBounds(sw, ne);
    },

    setBounds: function (bounds: LatLngBounds) {
        const map: Map = this.map;

        map.fitBounds(bounds, {
            animate: false
        });

        const bottomLeft = map.latLngToContainerPoint(bounds.getSouthWest());
        const topRight = map.latLngToContainerPoint(bounds.getNorthEast());

        this.setDimensions({
            width: topRight.x - bottomLeft.x,
            height: bottomLeft.y - topRight.y
        });
    },


    getBBoxCoordinates: function () {
        var size = this.map.getSize();

        var topRight = new Point(0, 0);
        var bottomLeft = new Point(0, 0);
        var topLeft = new Point(0, 0);
        var bottomRight = new Point(0, 0);

        bottomLeft.x = Math.round((size.x - this._width) / 2);
        topRight.y = Math.round((size.y - this._height) / 2);
        topRight.x = size.x - bottomLeft.x;
        bottomLeft.y = size.y - topRight.y;

        topLeft.x = bottomLeft.x;
        topLeft.y = topRight.y;
        bottomRight.x = topRight.x;
        bottomRight.y = bottomLeft.y;

        var coordinates =
            [
                { "sw": this.map.containerPointToLatLng(bottomLeft) },
                { "nw": this.map.containerPointToLatLng(topLeft) },
                { "ne": this.map.containerPointToLatLng(topRight) },
                { "se": this.map.containerPointToLatLng(bottomRight) }
            ]

        return coordinates
    },

    remove: function () {
        this.map.off("moveend", this._onMapChange);
        this.map.off("zoomend", this._onMapChange);
        this.map.off("resize", this._onMapResize);

        this._container.parentNode.removeChild(this._container);
    },


    setDimensions: function (dimensions: any) {
        if (!dimensions)
            return;

        this._height = parseInt(dimensions.height) || this._height;
        this._width = parseInt(dimensions.width) || this._width;
        this._render();
        this.fire("change");
    },


    _createElements: function () {
        if (!!this._container)
            return;

        this._container = DomUtil.create("div", "leaflet-areaselect-container", this.map._controlContainer)
        this._topShade = DomUtil.create("div", "leaflet-areaselect-shade leaflet-control", this._container);
        this._bottomShade = DomUtil.create("div", "leaflet-areaselect-shade leaflet-control", this._container);
        this._leftShade = DomUtil.create("div", "leaflet-areaselect-shade leaflet-control", this._container);
        this._rightShade = DomUtil.create("div", "leaflet-areaselect-shade leaflet-control", this._container);

        this._nwHandle = DomUtil.create("div", "leaflet-areaselect-handle leaflet-control", this._container);
        this._swHandle = DomUtil.create("div", "leaflet-areaselect-handle leaflet-control", this._container);
        this._neHandle = DomUtil.create("div", "leaflet-areaselect-handle leaflet-control", this._container);
        this._seHandle = DomUtil.create("div", "leaflet-areaselect-handle leaflet-control", this._container);

        this._setUpHandlerEvents(this._nwHandle);
        this._setUpHandlerEvents(this._neHandle, -1, 1);
        this._setUpHandlerEvents(this._swHandle, 1, -1);
        this._setUpHandlerEvents(this._seHandle, -1, -1);

        this.map.on("moveend", this._onMapChange, this);
        this.map.on("zoomend", this._onMapChange, this);
        this.map.on("resize", this._onMapResize, this);

        this.fire("change");
    },

    _setUpHandlerEvents: function (handle: HTMLElement, xMod: number, yMod: number) {
        xMod = xMod || 1;
        yMod = yMod || 1;

        var self = this;
        function onMouseDown(event: any) {
            event.stopPropagation();
            self.map.dragging.disable();
            DomEvent.removeListener(handle/* this as any */, "mousedown touchstart", onMouseDown);
            var curX = event.pageX;
            var curY = event.pageY;
            var ratio = self._width / self._height;
            var size = self.map.getSize();
            var mapContainer = self.map.getContainer();

            function onMouseMove(event: any) {
                if (self.options.keepAspectRatio) {
                    var maxHeight = (self._height >= self._width ? size.y : size.y * (1 / ratio)) - Math.max(self.options.minVerticalSpacing, self.options.minHorizontalSpacing);
                    self._height += (curY - event.pageY) * 2 * yMod;
                    self._height = Math.max(self.options.minHeight, self.options.minWidth, self._height);
                    self._height = Math.min(maxHeight, self._height);
                    self._width = self._height * ratio;
                } else {
                    self._width += (curX - event.pageX) * 2 * xMod;
                    self._height += (curY - event.pageY) * 2 * yMod;
                    self._width = Math.max(self.options.minWidth, self._width);
                    self._height = Math.max(self.options.minHeight, self._height);
                    self._width = Math.min(size.x - self.options.minHorizontalSpacing, self._width);
                    self._height = Math.min(size.y - self.options.minVerticalSpacing, self._height);
                }

                curX = event.pageX;
                curY = event.pageY;
                self._render();
            }
            function onMouseUp(event: any) {
                self.map.dragging.enable();
                DomEvent.removeListener(mapContainer, "mouseup touchend", onMouseUp);
                DomEvent.removeListener(mapContainer, "mousemove touchmove", onMouseMove);
                DomEvent.addListener(handle, "mousedown touchstart", onMouseDown);
                self.fire("change");
            }
            DomEvent.addListener(mapContainer, "mousemove touchmove", onMouseMove);
            DomEvent.addListener(mapContainer, "mouseup touchend", onMouseUp);
        }
        DomEvent.addListener(handle, "mousedown touchstart", onMouseDown);
    },

    _onMapResize: function () {
        this._render();
    },

    _onMapChange: function () {
        this.fire("change");
    },

    _render: function () {
        var size = this.map.getSize();
        var handleOffset = Math.round(this._nwHandle.offsetWidth / 2);

        var topBottomHeight = Math.round((size.y - this._height) / 2);
        var leftRightWidth = Math.round((size.x - this._width) / 2);

        function setDimensions(element: HTMLElement, dimension: any) {
            element.style.width = dimension.width + "px";
            element.style.height = dimension.height + "px";
            element.style.top = dimension.top + "px";
            element.style.left = dimension.left + "px";
            element.style.bottom = dimension.bottom + "px";
            element.style.right = dimension.right + "px";
        }

        setDimensions(this._topShade, { width: size.x, height: topBottomHeight, top: 0, left: 0 });
        setDimensions(this._bottomShade, { width: size.x, height: topBottomHeight, bottom: 0, left: 0 });
        setDimensions(this._leftShade, {
            width: leftRightWidth,
            height: size.y - (topBottomHeight * 2),
            top: topBottomHeight,
            left: 0
        });
        setDimensions(this._rightShade, {
            width: leftRightWidth,
            height: size.y - (topBottomHeight * 2),
            top: topBottomHeight,
            right: 0
        });

        setDimensions(this._nwHandle, { left: leftRightWidth - handleOffset, top: topBottomHeight - 7 });
        setDimensions(this._neHandle, { right: leftRightWidth - handleOffset, top: topBottomHeight - 7 });
        setDimensions(this._swHandle, { left: leftRightWidth - handleOffset, bottom: topBottomHeight - 7 });
        setDimensions(this._seHandle, { right: leftRightWidth - handleOffset, bottom: topBottomHeight - 7 });
    }
});

export { AreaSelect };