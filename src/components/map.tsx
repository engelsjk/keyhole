import { NextPage } from "next";
import { useEffect, useRef, useState, Fragment, useCallback } from "react";
import maplibregl, { DataDrivenPropertyValueSpecification, ExpressionSpecification, FilterSpecification, GeoJSONSource, MapLayerMouseEvent, MapMouseEvent } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { DateTime } from 'luxon';

import { useControl } from "~/context/controlContext";

import { Mission, Frame, Filters } from '~/shared/types';
import * as utils from '~/shared/utils';

const TILE_URLS = [
    'https://djellr4yg949p.cloudfront.net/keyhole',
    'https://d8it8dv6zj2fq.cloudfront.net/keyhole'
];

const DESIGNATOR_NAMES = [
    'KH-1',
    'KH-2',
    'KH-3',
    'KH-4',
    'KH-4A',
    'KH-4B',
    'KH-5',
    'KH-6',
    'KH-7',
    'KH-9'
];

const COLOR_BY_RESOLUTION_EXPR: DataDrivenPropertyValueSpecification<string> =
    [
        'match', ['get', 'r'],
        1, "#cb2d2e",
        2, "#e47fa9",
        3, "#88d27d",
        4, "#3295cc",
        5, "#e2ba7d",
        6, "#da8451",
        7, "#8e503b",
        8, "#463c3a",
        "grey",
    ];

const MISSIONS_LINE_WIDTH_EXPR: DataDrivenPropertyValueSpecification<string> = [
    'case',
    ['boolean', ['feature-state', 'hover'], false],
    5,
    0
];

const SWATHS_FILL_COLOR_EXPR_1: DataDrivenPropertyValueSpecification<string> = [
    'case',
    ['boolean', ['feature-state', 'click'], false],
    "#F9F9F9",
    [
        'match', ['get', 'a'],
        "Y", "#FFCB00",
        "N", COLOR_BY_RESOLUTION_EXPR,
        "gray"
    ]
];

const SWATHS_FILL_COLOR_EXPR_2: DataDrivenPropertyValueSpecification<string> = [
    'case',
    ['boolean', ['feature-state', 'click'], false],
    "#F9F9F9",
    COLOR_BY_RESOLUTION_EXPR
]

const SWATHS_LINE_COLOR_EXPR_1: DataDrivenPropertyValueSpecification<string> = [
    'case',
    ['any',
        ['boolean', ['feature-state', 'hover'], false],
        ['boolean', ['feature-state', 'click'], false]
    ],
    '#F9F9F9',
    SWATHS_FILL_COLOR_EXPR_1
];

const SWATHS_LINE_COLOR_EXPR_2: DataDrivenPropertyValueSpecification<string> = [
    'case',
    ['any',
        ['boolean', ['feature-state', 'hover'], false],
        ['boolean', ['feature-state', 'click'], false]
    ],
    '#F9F9F9',
    SWATHS_FILL_COLOR_EXPR_2
];

const SWATHS_LINE_WIDTH_EXPR: DataDrivenPropertyValueSpecification<any> = [
    'interpolate',
    ['exponential', 0.5],
    ['zoom'],
    2,
    [
        'case',
        ['boolean', ['feature-state', 'click'], false],
        4,
        [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            2,
            0.5
        ]
    ],
    7,
    [
        'case',
        ['boolean', ['feature-state', 'click'], false],
        6,
        [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            4,
            1
        ]
    ],
]

interface SwathLayer {
    designator: string,
    source: string,
    sourceLayer: string,
    lineLayer: string,
    fillLayer: string
}

interface Props { }

const getLayerFromDesignator = (d: string): SwathLayer => {
    const source = `swaths-${d}`;
    const sourceLayer = 'swaths';
    const lineLayer = `swaths-${d}-line`;
    const fillLayer = `swaths-${d}-fill`;
    return {
        designator: d,
        source: source,
        sourceLayer: sourceLayer,
        lineLayer: lineLayer,
        fillLayer: fillLayer
    }
}

const Map: NextPage<Props> = (props) => {

    const mapContainer = useRef<HTMLDivElement | null>(null);
    const [map, setMap] = useState<maplibregl.Map | null>(null);

    const [hoveredMission, setHoveredMission] = useState<string | undefined>(undefined);
    const [prevHoveredMission, setPrevHoveredMission] = useState<string | undefined>(undefined);

    const [hoveredFrame, setHoveredFrame] = useState<string | undefined>(undefined);
    const [prevHoveredFrame, setPrevHoveredFrame] = useState<string | undefined>(undefined);
    const [clickedFrame, setClickedFrame] = useState<string | undefined>(undefined);
    const [prevClickedFrame, setPrevClickedFrame] = useState<string | undefined>(undefined);

    const [swathLayer, setSwathLayer] = useState<SwathLayer | null>(null);

    const {
        selectedDesignator,
        selectedResolution,
        selectedMission,
        rangeAcquisitionYears,
        selectedCameraType,
        showDownloads,
        showFrame,
        mission,
        setFrame,
    } = useControl();

    useEffect(() => {
        if (map) return;

        let maplibreMap = new maplibregl.Map({
            container: mapContainer.current!,
            // style: "mapbox://styles/mapbox/light-v9",
            style: 'https://demotiles.maplibre.org/style.json',
            center: [8, 45],
            zoom: 2,
        });

        maplibreMap.on("load", () => {

            maplibreMap.resize();

            const layers = maplibreMap.getStyle().layers;
            var firstSymbolId: string = '';
            for (const layer of layers) {
                if (layer.type === 'symbol') {
                    firstSymbolId = layer.id;
                    break;
                }
            }

            maplibreMap.addSource('missions', {
                'type': 'vector',
                'tiles': TILE_URLS.map(u => `${u}/missions/{z}/{x}/{y}.pbf`),
                'minzoom': 0,
                'maxzoom': 8,
                'promoteId': 'm'
            });

            maplibreMap.addLayer({
                'id': 'missions-fill',
                'type': 'fill',
                'source': 'missions',
                'source-layer': 'missions',
                'paint': {
                    'fill-opacity': 0.7,
                    'fill-color': COLOR_BY_RESOLUTION_EXPR,
                    'fill-antialias': false
                },
                'layout': {
                    'visibility': 'visible',
                    'fill-sort-key': ['get', 'o']
                }
            }, firstSymbolId);

            // maplibreMap.addLayer({
            //     'id': 'missions-line',
            //     'type': 'line',
            //     'source': 'missions',
            //     'source-layer': 'missions',
            //     'paint': {
            //         'line-opacity': 1,
            //         'line-width': MISSIONS_LINE_WIDTH_EXPR,
            //         'line-color': 'white'
            //     },
            //     'layout': {
            //         'visibility': 'visible',
            //     }
            // }, firstSymbolId);

            // const onMouseMoveFill = (e: MapLayerMouseEvent) => {
            //     maplibreMap.getCanvas().style.cursor = 'pointer';
            //     if (e.features) {
            //         const missionID = e.features[0].id as string;
            //         setHoveredMission(missionID);
            //     }
            // }

            // const onMouseLeaveFill = (e: MapLayerMouseEvent) => {
            //     maplibreMap.getCanvas().style.cursor = '';
            //     setHoveredMission(undefined);
            // }

            // maplibreMap.on('mousemove', 'missions-fill', onMouseMoveFill);
            // maplibreMap.on('mouseleave', 'missions-fill', onMouseLeaveFill);

            DESIGNATOR_NAMES.forEach((designatorName) => {

                const layer = getLayerFromDesignator(designatorName);

                maplibreMap.addSource(layer.source, {
                    'type': 'vector',
                    'tiles': TILE_URLS.map(
                        u => `${u}/swaths/${layer.designator}/{z}/{x}/{y}.pbf`
                    ),
                    'minzoom': 0,
                    'maxzoom': 8,
                    'promoteId': 'e'
                });

                maplibreMap.addLayer({
                    'id': layer.fillLayer,
                    'type': 'fill',
                    'source': layer.source,
                    'source-layer': layer.sourceLayer,
                    'paint': {
                        'fill-color': SWATHS_FILL_COLOR_EXPR_1,
                        'fill-opacity': [
                            'case',
                            ['boolean', ['feature-state', 'click'], false],
                            0.5,
                            0.25
                        ],
                        'fill-antialias': false
                    },
                    'layout': {
                        'visibility': 'none' //'visible' //'none'
                    },
                    'filter': false //['==', ['get', 'm'], '9009'] // false
                }, firstSymbolId);

                maplibreMap.addLayer({
                    'id': layer.lineLayer,
                    'type': 'line',
                    'source': layer.source,
                    'source-layer': layer.sourceLayer,
                    'paint': {
                        'line-opacity': 1,
                        'line-width': SWATHS_LINE_WIDTH_EXPR,
                        'line-color': SWATHS_LINE_COLOR_EXPR_1
                    },
                    'layout': {
                        'visibility': 'none' //'visible' //'none'
                    },
                    'filter': false //['==', ['get', 'm'], '9009'] // false
                }, firstSymbolId);

            });

            setMap(maplibreMap);
        });

    }, [map]);

    // MISSIONS FILTERS
    useEffect(() => {
        if (!map) {
            return;
        }

        if (mission) {
            map.setLayoutProperty('missions-fill', 'visibility', 'none');
            return;
        }

        map.setLayoutProperty('missions-fill', 'visibility', 'visible');

        var designatorFilter: FilterSpecification = ['has', 'd'];
        var resolutionFilter: FilterSpecification = ['has', 'r'];
        var missionFilter: FilterSpecification = ['has', 'm'];
        var yearsFilter: FilterSpecification = ['has', 'e'];

        if (selectedDesignator) {
            designatorFilter = ['==', ['get', 'd'], selectedDesignator];
        }

        if (selectedResolution) {
            resolutionFilter = ['==', ['get', 'r'], selectedResolution];
        }

        if (selectedMission) {
            missionFilter = ['==', ['get', 'm'], selectedMission];
        }

        if (rangeAcquisitionYears) {
            const ts = utils.range2time(rangeAcquisitionYears);
            yearsFilter = [
                'all',
                ['>=', ['get', 'e'], ts[0]],
                ['<=', ['get', 'l'], ts[1]]
            ];
        }

        const filterExpressions: FilterSpecification = ['all', designatorFilter, resolutionFilter, missionFilter, yearsFilter];
        map.setFilter('missions-fill', filterExpressions);

    }, [selectedDesignator, selectedResolution, selectedMission, rangeAcquisitionYears]);

    // SWATH FILTER
    useEffect(() => {
        if (!map) return;

        const onMouseMoveFill = (e: MapLayerMouseEvent) => {
            map.getCanvas().style.cursor = 'pointer';
            if (e.features) {
                const frameID = e.features[0].id as string;
                setHoveredFrame(frameID);
            }
        }

        const onMouseLeaveFill = (e: MapLayerMouseEvent) => {
            map.getCanvas().style.cursor = '';
            setHoveredFrame(undefined);
        }

        const onClickFill = (e: MapLayerMouseEvent) => {
            e.preventDefault();
            if (e.features) {
                const frameID = e.features[0].id as string;
                setClickedFrame(frameID);
                setFrame(e.features[0].properties as Frame);
            }
        }

        const onClick = (e: MapLayerMouseEvent) => {
            if (e.defaultPrevented === false) {
                setClickedFrame(undefined);
                setFrame(null);
            }
        }

        map.on('click', onClick);

        DESIGNATOR_NAMES.forEach((designatorName) => {
            const layer = getLayerFromDesignator(designatorName);
            map.setLayoutProperty(layer.lineLayer, 'visibility', 'none');
            map.setLayoutProperty(layer.fillLayer, 'visibility', 'none');
            map.off('mousemove', layer.fillLayer, onMouseMoveFill);
            map.off('mouseleave', layer.fillLayer, onMouseLeaveFill);
            map.off('click', layer.fillLayer, onClickFill);
        });

        if (!mission) {
            setSwathLayer(null);
            return;
        };

        const layer = getLayerFromDesignator(mission.d);
        setSwathLayer(layer);

        map.setLayoutProperty(layer.lineLayer, 'visibility', 'visible');
        map.setLayoutProperty(layer.fillLayer, 'visibility', 'visible');
        map.on('mousemove', layer.fillLayer, onMouseMoveFill);
        map.on('mouseleave', layer.fillLayer, onMouseLeaveFill);
        map.on('click', layer.fillLayer, onClickFill);

        var missionFilter: FilterSpecification = ['has', 'm'];
        var cameraTypeFilter: FilterSpecification = ['has', 'c'];

        if (mission) {
            missionFilter = ['==', ['get', 'm'], mission.m];
        }

        if (selectedCameraType && selectedCameraType != 'ALL') {
            cameraTypeFilter = ['==', ['get', 'c'], selectedCameraType];
        }

        const filterExpressions: FilterSpecification = ['all', missionFilter, cameraTypeFilter];

        map.setFilter(layer.lineLayer, filterExpressions);
        map.setFilter(layer.fillLayer, filterExpressions);

    }, [selectedMission, selectedCameraType]);

    // HOVER MISSION
    // useEffect(() => {
    //     if (!map) return;
    //     if (mission) return;

    //     if (prevHoveredMission && hoveredMission != prevHoveredMission) {
    //         map.setFeatureState({
    //             source: 'missions',
    //             sourceLayer: 'missions', id: prevHoveredMission
    //         }, { hover: false });
    //     }
    //     if (hoveredMission) {
    //         map.setFeatureState({
    //             source: 'missions',
    //             sourceLayer: 'missions', id: hoveredMission
    //         }, { hover: true });
    //     }

    //     setPrevHoveredMission(hoveredMission);

    // }, [hoveredMission, prevHoveredMission]);

    // HOVER FRAME
    useEffect(() => {
        if (!map) return;
        if (!swathLayer) return;

        if (prevHoveredFrame && hoveredFrame != prevHoveredFrame) {
            map.setFeatureState({
                source: swathLayer.source,
                sourceLayer: swathLayer.sourceLayer, id: prevHoveredFrame
            }, { hover: false });
        }
        if (hoveredFrame) {
            map.setFeatureState({
                source: swathLayer.source,
                sourceLayer: swathLayer.sourceLayer, id: hoveredFrame
            }, { hover: true });
        }

        setPrevHoveredFrame(hoveredFrame);

    }, [hoveredFrame, prevHoveredFrame]);

    // CLICKED FRAME
    useEffect(() => {
        if (!map) return;
        if (!swathLayer) return;

        if (prevClickedFrame && clickedFrame != prevClickedFrame) {
            map.setFeatureState({
                source: swathLayer.source,
                sourceLayer: swathLayer.sourceLayer, id: prevClickedFrame
            }, { click: false });
        }
        if (clickedFrame) {
            map.setFeatureState({
                source: swathLayer.source,
                sourceLayer: swathLayer.sourceLayer, id: clickedFrame
            }, { click: true });
        }

        setPrevClickedFrame(clickedFrame);

    }, [clickedFrame, prevClickedFrame]);

    // SHOW DOWNLOADS
    useEffect(() => {
        if (!map) return;
        if (!mission || !swathLayer) return;

        var lineExpr: ExpressionSpecification = SWATHS_LINE_COLOR_EXPR_2;
        var fillExpr: ExpressionSpecification = SWATHS_FILL_COLOR_EXPR_2;

        if (showDownloads) {
            lineExpr = SWATHS_LINE_COLOR_EXPR_1;
            fillExpr = SWATHS_FILL_COLOR_EXPR_1;
        }

        map.setPaintProperty(swathLayer.lineLayer, 'line-color', lineExpr);
        map.setPaintProperty(swathLayer.fillLayer, 'fill-color', fillExpr);

    }, [showDownloads]);

    return (
        <div ref={mapContainer} style={{
            position: 'relative',
            top: 0,
            bottom: 0,
            width: '100%',
            height: '100%'
        }} />
    );
}

export default Map;