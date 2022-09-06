import { NextPage } from "next";
import { useEffect, useRef, useState, Fragment, useCallback } from "react";
import maplibregl, { DataDrivenPropertyValueSpecification, FilterSpecification, GeoJSONSource, MapLayerMouseEvent, MapMouseEvent } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import { DateTime } from 'luxon';

import { Mission, Filters } from '~/shared/types';

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

const LINE_WIDTH_EXPR: DataDrivenPropertyValueSpecification<any> = [
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
    designator: string | undefined,
    source: string,
    sourceLayer: string,
    lineLayer: string,
    fillLayer: string
}

interface Props {
    filters: Filters;
    mission: Mission | undefined;
}

const getDesignatorSourceInfo = (d: string | undefined): SwathLayer => {
    // const d = designator ? designator : props.filters.designator;
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

    const [selectedMission, setSelectedMission] = useState<Mission | undefined>(undefined);
    const [hoveredFrame, setHoveredFrame] = useState<string | undefined>(undefined);
    const [selectedSwathLayer, setSelectedSwathLayer] = useState<SwathLayer | undefined>(undefined);

    useEffect(() => {
        console.log('map')

        if (map) return;

        let maplibreMap = new maplibregl.Map({
            container: mapContainer.current!,
            // style: "mapbox://styles/mapbox/light-v9",
            style: 'https://demotiles.maplibre.org/style.json',
            center: [8, 45],
            zoom: 2,
        });

        maplibreMap.on("load", () => {

            setMap(maplibreMap);
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
                'maxzoom': 8
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
                    'fill-sort-key': ['get', 'o']
                }
            }, firstSymbolId);

            DESIGNATOR_NAMES.forEach((designatorName) => {

                const d = getDesignatorSourceInfo(designatorName);

                maplibreMap.addSource(d.source, {
                    'type': 'vector',
                    'tiles': TILE_URLS.map(
                        u => `${u}/swaths/${d.designator}/{z}/{x}/{y}.pbf`
                    ),
                    'minzoom': 0,
                    'maxzoom': 8,
                    'promoteId': 'e'
                });

                maplibreMap.addLayer({
                    'id': d.fillLayer,
                    'type': 'fill',
                    'source': d.source,
                    'source-layer': d.sourceLayer,
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
                    'id': d.lineLayer,
                    'type': 'line',
                    'source': d.source,
                    'source-layer': d.sourceLayer,
                    'paint': {
                        'line-opacity': 1,
                        'line-width': LINE_WIDTH_EXPR,
                        'line-color': 'white' // SWATHS_LINE_COLOR_EXPR_1
                    },
                    'layout': {
                        'visibility': 'none' //'visible' //'none'
                    },
                    'filter': false //['==', ['get', 'm'], '9009'] // false
                }, firstSymbolId);

            });
        });

    }, [map]);

    useEffect(() => {
        console.log("map_selectedMission");

        if (!map) return;

        const onMouseMoveFill = (e: MapLayerMouseEvent) => {
            map.getCanvas().style.cursor = 'pointer';
            if (e.features) {
                if (!hoveredFrame) {
                    // setMapFeatureState(d.source, d.sourceLayer, state.hoverID, { hover: false });
                }
                setHoveredFrame(e.features[0].id as string);
                // setMapFeatureState(d.source, d.sourceLayer, state.hoverID, { hover: true });
            }
        }

        const onMouseLeaveFill = (e: MapLayerMouseEvent) => {
            map.getCanvas().style.cursor = '';
            if (hoveredFrame) {
                // setMapFeatureState(d.source, d.sourceLayer, state.hoverID, { hover: false });
            }
            setHoveredFrame(undefined);
        }

        const setMapFeatureState = (source: string, sourceLayer: string, id: string, state: string) => {
            map.setFeatureState(
                { source: source, sourceLayer: sourceLayer, id: id },
                state
            );
        }

        DESIGNATOR_NAMES.forEach((designatorName) => {
            const d = getDesignatorSourceInfo(designatorName);
            if (selectedMission && selectedMission.d == designatorName) {

                map.setFilter(d.lineLayer, ['==', ['get', 'm'], selectedMission.m]);
                map.setFilter(d.fillLayer, ['==', ['get', 'm'], selectedMission.m]);

                map.setLayoutProperty(d.lineLayer, 'visibility', 'visible');
                map.setLayoutProperty(d.fillLayer, 'visibility', 'visible');

                map.on('mousemove', d.fillLayer, onMouseMoveFill);
                map.on('mouseleave', d.fillLayer, onMouseLeaveFill);
            } else {

                map.setFilter(d.lineLayer, false);
                map.setFilter(d.fillLayer, false);

                map.setLayoutProperty(d.lineLayer, 'visibility', 'none');
                map.setLayoutProperty(d.fillLayer, 'visibility', 'none');

                map.off('mousemove', d.fillLayer, onMouseMoveFill);
                map.off('mouseleave', d.fillLayer, onMouseLeaveFill);
            }
        });

    }, [map, selectedMission]);

    useEffect(() => {
        console.log("props.mission")

        setSelectedMission(props.mission);
        if (selectedMission) {
            const swathLayer = getDesignatorSourceInfo(selectedMission.d)
            setSelectedSwathLayer(swathLayer);
        } else {
            setSelectedSwathLayer(undefined);
        }
    }, [props.mission]);

    useEffect(() => {
        console.log(`hoveredFrame: ${hoveredFrame}`);
    }, [hoveredFrame]);

    useEffect(() => {
        console.log('map_props.filters')

        if (!map) {
            return;
        }

        var designatorFilter: FilterSpecification = ['has', 'd'];
        var resolutionFilter: FilterSpecification = ['has', 'r'];
        var missionFilter: FilterSpecification = ['has', 'm'];
        var yearsFilter: FilterSpecification = ['has', 'y'];

        if (props.filters.designator) {
            designatorFilter = ['==', ['get', 'd'], props.filters.designator];
        }

        if (props.filters.resolution) {
            resolutionFilter = ['==', ['get', 'r'], props.filters.resolution];
        }

        if (props.filters.mission) {
            missionFilter = ['==', ['get', 'm'], props.filters.mission];
        }

        if (props.filters.years) {
            const dt_e = DateTime.fromFormat(`${props.filters.years[0].toString()}-01-01`, 'yyyy-mm-dd');
            const dt_l = DateTime.fromFormat(`${props.filters.years[1].toString()}-12-31`, 'yyyy-MM-dd');
            yearsFilter = [
                'all',
                ['>=', ['get', 'e'], dt_e.toSeconds()],
                ['<=', ['get', 'l'], dt_l.toSeconds()]
            ];
        }

        const filterExpressions: FilterSpecification = ['all', designatorFilter, resolutionFilter, missionFilter, yearsFilter];

        map.setFilter('missions-fill', filterExpressions);

        console.log(map);
        console.log(map.getLayer('missions-fill'))

    }, [map, props.filters]);

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