System.register(['angular2/core', './esri-map-view.component', 'esri-mods'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, esri_map_view_component_1, esri_mods_1;
    var GeometryEngineShowcaseComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (esri_map_view_component_1_1) {
                esri_map_view_component_1 = esri_map_view_component_1_1;
            },
            function (esri_mods_1_1) {
                esri_mods_1 = esri_mods_1_1;
            }],
        execute: function() {
            GeometryEngineShowcaseComponent = (function () {
                function GeometryEngineShowcaseComponent() {
                    this.viewReference = null;
                    this.volcanoesLayer = null;
                    this.volcanoesLayerView = null;
                    this.analysisLayer = null;
                    this.bufferDistance = 30;
                    this.featureCount = 0;
                    this.bufferPolygonSize = 0;
                    this.convexHullPolygonSize = 0;
                }
                GeometryEngineShowcaseComponent.prototype.setView = function (viewRef) {
                    this.viewReference = viewRef;
                    this.volcanoesLayer = this.viewReference.map.getLayer('volcanoesLayer');
                    this.volcanoesLayerView = this.viewReference.getLayerView(this.volcanoesLayer); // this is used to access graphics array
                    this.analysisLayer = this.viewReference.map.getLayer('analysisLayer');
                };
                GeometryEngineShowcaseComponent.prototype.startBuffering = function (bufferDistance) {
                    var _this = this;
                    if (!this.volcanoesLayerView) {
                        // just in case this wasn't ready or available in setView method
                        this.volcanoesLayerView = this.viewReference.getLayerView(this.volcanoesLayer);
                    }
                    var geoms = this.volcanoesLayerView.graphics.map(function (g) { return g.geometry; });
                    // var geoms = this.volcanoesLayerView._graphicsCollection.map(g => g.geometry);
                    geoms = geoms.filter(function (geom) { return _this.viewReference.extent.contains(geom); });
                    // update template bindings
                    this.bufferDistance = bufferDistance;
                    this.featureCount = geoms.length;
                    // calculate the geodesic buffer geometry with unioned outputs
                    esri_mods_1.geometryEngineAsync.geodesicBuffer(geoms.items, this.bufferDistance, 'kilometers', true).then(function (bufferGeometries) {
                        var bufferGeometry = bufferGeometries[0];
                        // calculate area and update template binding
                        esri_mods_1.geometryEngineAsync.geodesicArea(bufferGeometry, 'square-kilometers').then(function (res) {
                            this.bufferPolygonSize = res;
                        }.bind(this));
                        // create a graphic to display the new unioned buffer geometry
                        var bufferGraphic = new esri_mods_1.Graphic({
                            geometry: bufferGeometry,
                            symbol: new esri_mods_1.SimpleFillSymbol({
                                color: [227, 139, 79, 0.7],
                                outline: new esri_mods_1.SimpleLineSymbol({
                                    color: [255, 255, 255],
                                    width: 1
                                })
                            })
                        });
                        // calculate the convex hull geometry
                        esri_mods_1.geometryEngineAsync.convexHull(bufferGeometry, true).then(function (convexHullGeometry) {
                            // calculate area and update template binding
                            esri_mods_1.geometryEngineAsync.geodesicArea(convexHullGeometry, 'square-kilometers').then(function (res) {
                                this.convexHullPolygonSize = res;
                            }.bind(this));
                            // create a graphic to display the new convex hull geometry
                            var convexHullGraphic = new esri_mods_1.Graphic({
                                geometry: convexHullGeometry,
                                symbol: new esri_mods_1.SimpleFillSymbol({
                                    color: [255, 255, 255, 0],
                                    outline: new esri_mods_1.SimpleLineSymbol({
                                        color: [255, 255, 255],
                                        width: 2
                                    })
                                })
                            });
                            // add both the buffer and convex hull graphics to the map
                            this.addAnalysisResultsToMap(bufferGraphic, convexHullGraphic);
                        }.bind(this));
                    }.bind(this));
                };
                GeometryEngineShowcaseComponent.prototype.addAnalysisResultsToMap = function () {
                    var analysisGraphics = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        analysisGraphics[_i - 0] = arguments[_i];
                    }
                    this.analysisLayer.clear();
                    this.analysisLayer.add(analysisGraphics);
                };
                GeometryEngineShowcaseComponent = __decorate([
                    core_1.Component({
                        selector: 'geometry-engine-showcase',
                        styles: ["\n        .workflow {\n            font-style: italic;\n            font-size: 0.8em;\n        }\n        .rangeSlider {\n            margin: 0 10px;\n            max-width: 200px;\n            vertical-align: middle;\n        }\n        .label-override {\n            margin-left: 0;\n            margin-right: 1em;\n        }\n        .card pre {\n            margin: 0 15px 20px 15px;\n            width: auto;\n        }\n        "],
                        template: "\n        <h4>Vector GIS analysis with Esri's client-side geometry engine</h4>\n\n        <esri-map-view #mapView (viewCreated)=\"setView(mapView.view)\"\n            zoom=\"6\" centerLng=\"-18.5\" centerLat=\"65\" rotation=\"180\">\n        </esri-map-view>\n\n        <span class=\"workflow\">Workflow: create geodesic buffer &rarr; create convex hull &rarr; calculate buffer and convex hull areas</span>\n\n        <p>Change the buffer distance to begin:</p>\n        <div>\n            <input type=\"range\" min=\"10\" max=\"300\" step=\"5\"\n                class=\"rangeSlider\"\n                [value]=\"bufferDistance\"\n                (input)=\"startBuffering($event.target.value)\"\n                (change)=\"startBuffering($event.target.value)\">\n            <span>{{ bufferDistance }} km</span>\n        </div>\n        \n        <ul>\n            <li>volcanoes buffered in extent: {{ featureCount }}</li>\n            <li>unioned buffer area: {{ bufferPolygonSize | number:'1.1-1' }} km<sup>2</sup></li>\n            <li>convex hull area: {{ convexHullPolygonSize | number:'1.1-1' }} km<sup>2</sup></li>\n        </ul>\n\n        <div class=\"card\">\n            <p><span class=\"label label-override\">Info</span>This Esri map view was created with a custom Angular 2 component with several <code>@Input</code> bindings and an <code>EventEmitter()</code> event binding:</p>\n            <pre>\n<code>&lt;esri-map-view #mapView (viewCreated)=\"setView(mapView.view)\"\n    zoom=\"6\" centerLng=\"-18.5\" centerLat=\"65\" rotation=\"180\"&gt;\n&lt;/esri-map-view&gt;</code>\n            </pre>\n        </div>\n        ",
                        /*<esri-scene-view #geSceneView (viewCreated)="setView(geSceneView.view)"></esri-scene-view>*/
                        /*directives: [EsriSceneViewComponent],
                        providers: [ViewCoordinationService]*/
                        directives: [esri_map_view_component_1.EsriMapViewComponent]
                    }), 
                    __metadata('design:paramtypes', [])
                ], GeometryEngineShowcaseComponent);
                return GeometryEngineShowcaseComponent;
            }());
            exports_1("GeometryEngineShowcaseComponent", GeometryEngineShowcaseComponent);
        }
    }
});
//# sourceMappingURL=geometry-engine-showcase.component.js.map