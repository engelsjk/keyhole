import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapLayerMouseEvent, DataDrivenPropertyValueSpecification, AttributionControl } from 'maplibre-gl'
import { useAppContext } from "~/context/appContext";
import { Frame } from '~/shared/types';
import * as utils from '~/shared/utils';
import { CDN_TILE_URLS, MISSIONS_BY_DATASET_ID } from '~/components/constants';

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

const SWATHS_LINE_WIDTH_EXPR: DataDrivenPropertyValueSpecification<string> = [
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

const FOG_PARAMS = {
    "color": 'rgba(0, 0, 0, 0.5)',
    "horizon-blend": 0.01,
    "range": [0.5, 1.0],
    "high-color": 'rgba(238,238,238,0.3)',
    "space-color": 'rgba(25,25,25,1.0)',
    "star-intensity": 0.25
};

interface MissionLayer {
    source: string,
    sourceLayer: string,
    fillLayer: string
}

interface SwathLayer {
    mission: string,
    source: string,
    sourceLayer: string,
    lineLayer: string,
    fillLayer: string
}

interface Props { }

const getMissionLayer = () => {
    const source = 'missions';
    const sourceLayer = 'missions';
    const fillLayer = 'missions-fill';
    return {
        source: source,
        sourceLayer: sourceLayer,
        fillLayer: fillLayer
    }
}

const getSwathLayerFromMission = (mission_id: string): SwathLayer => {
    const ii = mission_id;
    const source = `swaths-${ii}`;
    const sourceLayer = 'swaths';
    const lineLayer = `swaths-${ii}-line`;
    const fillLayer = `swaths-${ii}-fill`;
    return {
        mission: mission_id,
        source: source,
        sourceLayer: sourceLayer,
        lineLayer: lineLayer,
        fillLayer: fillLayer
    }
}

const getFirstLayerID = (m: maplibregl.Map): string => {
    const layers = m.getStyle().layers;
    var firstSymbolId: string = '';
    for (const layer of layers) {
        if (layer.type === 'symbol') {
            firstSymbolId = layer.id;
            break;
        }
    }
    return firstSymbolId;
}

const addMissionSourcesToMap = (map: maplibregl.Map | null) => {
    if (!map) return;
    console.log("adding mission sources to map")
    map.addSource("missions", {
        type: "vector",
        url: `pmtiles://${CDN_TILE_URLS[0]}/keyhole-dev/pmtiles/20241210/missions.pmtiles`,
        attribution: 'Swath data from <a target="_blank" href="https://earthexplorer.usgs.gov/">USGS Earth Explorer</a>'
    });
}

const addMissionLayerToMap = (map: maplibregl.Map | null, layer: MissionLayer) =>  {
    if (!map) return;
    console.log("adding mission layers to map")
    if(map.getLayer(layer.fillLayer)) return;
    map.addLayer({
        "id": layer.fillLayer,
        "source": layer.source,
        "source-layer": layer.sourceLayer,
        "type": "fill",
        'paint': {
            'fill-opacity': 0.4,
            'fill-color': COLOR_BY_RESOLUTION_EXPR,
            'fill-antialias': false
        },
        'layout': {
            'visibility': 'visible',
            'fill-sort-key': ['get', 'o']
        }
    });
}

const addSwathSourceToMap = (map: maplibregl.Map | null, mission_id: string) => {
    if (!map) return;
    console.log("adding swath source to map")
    const source = `swaths-${mission_id}`;
    if (map.getSource(source)) return;
    map.addSource(source, {
        type: "vector",
        url: `pmtiles://${CDN_TILE_URLS[0]}/keyhole-dev/pmtiles/20241210/missions/${mission_id}.pmtiles`,
        attribution: 'Swath data from <a target="_blank" href="https://earthexplorer.usgs.gov/">USGS Earth Explorer</a>'
    })
}


const addSwathSourcesToMap = (map: maplibregl.Map | null) => {
    if (!map) return;
    console.log("adding swath sources to map")
    const dataset_ids = Object.keys(MISSIONS_BY_DATASET_ID);
    for (const dataset_id of dataset_ids) {
        let missions = MISSIONS_BY_DATASET_ID[dataset_id];
        for (const mission_id of missions) {
            addSwathSourceToMap(map, mission_id);
        }
    }
}

const addSwathLayerToMap = (map: maplibregl.Map | null, layer: SwathLayer, mission_id: string) => {
    if (!map) return;
    console.log("adding swath layer to map");
    if(map.getLayer(layer.fillLayer)) return;
    const firstSymbolId = getFirstLayerID(map);
    map.addLayer({
        'id': layer.fillLayer,
        'type': 'fill',
        'source': layer.source,
        'source-layer': layer.sourceLayer,
        'paint': {
            'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'click'], false],
                0.5,
                0.25
            ],
            'fill-color': SWATHS_FILL_COLOR_EXPR_1,

            'fill-antialias': false
        },
        'layout': {
            'visibility': 'none'
        },
        'filter': ['==', ['get', 'm'], mission_id]
    }, firstSymbolId);
    map.addLayer({
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
            'visibility': 'none'
        },
        'filter': ['==', ['get', 'm'], mission_id]
    }, firstSymbolId);
}

const addSwathLayersToMap = (map: maplibregl.Map | null) => {
    console.log("addSwathLayersToMap");
    if (!map) return;
    console.log("adding swath layers to map");
    const dataset_ids = Object.keys(MISSIONS_BY_DATASET_ID);
    for (const dataset_id of dataset_ids) {
        let missions = MISSIONS_BY_DATASET_ID[dataset_id];
        for (const mission_id of missions) {
            let layer = getSwathLayerFromMission(mission_id);
            addSwathLayerToMap(map, layer, mission_id);
        }
    }
}

const Map: NextPage<Props> = (props) => {

    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<maplibregl.Map | null>(null);

    const [hoveredFrame, setHoveredFrame] = useState<string | undefined>(undefined);
    const [prevHoveredFrame, setPrevHoveredFrame] = useState<string | undefined>(undefined);
    const [clickedFrame, setClickedFrame] = useState<string | undefined>(undefined);
    const [prevClickedFrame, setPrevClickedFrame] = useState<string | undefined>(undefined);
    const [missionLayer, setMissionLayer] = useState<MissionLayer | null>(null);
    const [swathLayer, setSwathLayer] = useState<SwathLayer | null>(null);

    const {
        selectedDesignator,
        selectedResolution,
        acquisitionRange,
        acquisitionTimeRange,
        selectedCameraType,
        highlightDownloads,
        mission,
        setFrame,
        mapLoading,
        setMapLoading,
        projection,
    } = useAppContext();

    useEffect(() => {
        if (map.current || !mapContainer.current || mapLoading) return;

        setMapLoading(true)

        const missionLayer = getMissionLayer()
        setMissionLayer(missionLayer)

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_TOKEN}`,
            center: [46.54, 17.76],
            zoom: 2.5,
            minZoom: 0,
            maxZoom: 8,
            attributionControl: false,
        });

        map.current.on('style.load', () => {
            if(!map.current) return;
            map.current.setProjection({
                type: 'globe',
            });
        });

        map.current.on("load", () => {
            addMissionSourcesToMap(map.current);
            addMissionLayerToMap(map.current, missionLayer);
            addSwathSourcesToMap(map.current);
            addSwathLayersToMap(map.current);
            setMapLoading(false);
            if(map.current){
                map.current.addControl(new AttributionControl({
                    compact: true
                }))
            } 
        });
    }, [map, mapContainer, mapLoading, setMapLoading]);

    // Updates the missions layer filter when a user selects a mission or adjusts one of the filters
    useEffect(() => {
        if (!map.current || !missionLayer) return;
        if (!map.current.getLayer(missionLayer.fillLayer)) return;
        if (mission) {
            map.current.setLayoutProperty(missionLayer.fillLayer, 'visibility', 'none');
            return;
        }
        map.current.setLayoutProperty(missionLayer.fillLayer, 'visibility', 'visible');
        let designatorFilter: DataDrivenPropertyValueSpecification<string> = ['has', 'd']; // true
        let resolutionFilter: DataDrivenPropertyValueSpecification<string> = ['has', 'r']; // true
        let missionFilter: DataDrivenPropertyValueSpecification<string> = ['has', 'm']; // true
        let timeFilter: DataDrivenPropertyValueSpecification<string> = ['has', 'e']; // true
        if (selectedDesignator) {
            designatorFilter = ['==', ['get', 'd'], selectedDesignator];
        }
        if (selectedResolution) {
            resolutionFilter = ['==', ['get', 'r'], selectedResolution];
        }
        if (acquisitionTimeRange.interval) {
            const ts = utils.RangeToTimestamps(acquisitionRange, acquisitionTimeRange);
            timeFilter = [
                'all',
                ['<=', ['get', 'e'], ts[1]],
                ['>=', ['get', 'l'], ts[0]]
            ];
        }
        const filterExpressions: DataDrivenPropertyValueSpecification<string> = ['all', designatorFilter, resolutionFilter, missionFilter, timeFilter];
        map.current.setFilter(missionLayer.fillLayer, filterExpressions, { validate: false });
    }, [map, mission, missionLayer, selectedDesignator, selectedResolution, acquisitionRange, acquisitionTimeRange]);


    // Updates the swath layer when a user selects a mission
    useEffect(() => {
        if (!map.current || !mission) return;
        const layer = getSwathLayerFromMission(mission.m);
        if (swathLayer && layer.mission == swathLayer.mission) return;
        if (swathLayer) {
            map.current.setLayoutProperty(swathLayer.lineLayer, 'visibility', 'none');
            map.current.setLayoutProperty(swathLayer.fillLayer, 'visibility', 'none');
        }
        map.current.setLayoutProperty(layer.lineLayer, 'visibility', 'visible');
        map.current.setLayoutProperty(layer.fillLayer, 'visibility', 'visible');
        const onMouseMoveFill = (e: MapLayerMouseEvent) => {
            if(!map.current) return;
            map.current.getCanvas().style.cursor = 'pointer';
            if (e.features) {
                const frameID = e.features[0].id as string;
                setHoveredFrame(frameID);
            }
        }
        const onMouseLeaveFill = (e: MapLayerMouseEvent) => {
            if(!map.current) return;
            map.current.getCanvas().style.cursor = '';
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
        map.current.on('click', onClick);
        map.current.on('mousemove', layer.fillLayer, onMouseMoveFill);
        map.current.on('mouseleave', layer.fillLayer, onMouseLeaveFill);
        map.current.on('click', layer.fillLayer, onClickFill);
        setSwathLayer(layer);
    }, [map, mission, swathLayer, setSwathLayer, setClickedFrame, setHoveredFrame, setFrame]);

    // Updates the swath layer filters when a user selects a mission or camera type
    useEffect(() => {
        if (!map.current) return;
        if (!mission && swathLayer) {
            if (map.current.getLayer(swathLayer.lineLayer) && map.current.getLayer(swathLayer.fillLayer)) {
                map.current.setLayoutProperty(swathLayer.lineLayer, 'visibility', 'none');
                map.current.setLayoutProperty(swathLayer.fillLayer, 'visibility', 'none');
            }
            return;
        }
        if (!swathLayer) return;
        if (map.current.getLayer(swathLayer.lineLayer) && map.current.getLayer(swathLayer.fillLayer)) {
            map.current.setLayoutProperty(swathLayer.lineLayer, 'visibility', 'visible');
            map.current.setLayoutProperty(swathLayer.fillLayer, 'visibility', 'visible');
        }
        var missionFilter: DataDrivenPropertyValueSpecification<string> = ['has', 'm'];
        var cameraTypeFilter: DataDrivenPropertyValueSpecification<string> = ['has', 'c'];
        if (mission) {
            missionFilter = ['==', ['get', 'm'], mission.m];
        }
        if (selectedCameraType && selectedCameraType != 'ALL') {
            cameraTypeFilter = ['==', ['get', 'c'], selectedCameraType];
        }
        const filterExpressions: DataDrivenPropertyValueSpecification<string> = ['all', missionFilter, cameraTypeFilter];
        if (map.current.getLayer(swathLayer.lineLayer) && map.current.getLayer(swathLayer.fillLayer)) {
            map.current.setFilter(swathLayer.lineLayer, filterExpressions);
            map.current.setFilter(swathLayer.fillLayer, filterExpressions);
        }
    }, [map, mission, swathLayer, selectedCameraType]);

    // Updates the map feature state when a user hovers on a frame
    useEffect(() => {
        if (!map.current || !swathLayer) return;
        if (prevHoveredFrame && hoveredFrame != prevHoveredFrame) {
            map.current.setFeatureState({
                source: swathLayer.source,
                sourceLayer: swathLayer.sourceLayer, id: prevHoveredFrame
            }, { hover: false });
        }
        if (hoveredFrame) {
            map.current.setFeatureState({
                source: swathLayer.source,
                sourceLayer: swathLayer.sourceLayer, id: hoveredFrame
            }, { hover: true });
        }
        setPrevHoveredFrame(hoveredFrame);
    }, [map, swathLayer, hoveredFrame, prevHoveredFrame]);

    // Updates the map feature state when the user clicks on a frame
    useEffect(() => {
        if (!map.current || !swathLayer) return;
        if (prevClickedFrame && clickedFrame != prevClickedFrame) {
            map.current.setFeatureState({
                source: swathLayer.source,
                sourceLayer: swathLayer.sourceLayer, id: prevClickedFrame
            }, { click: false });
        }
        if (clickedFrame) {
            map.current.setFeatureState({
                source: swathLayer.source,
                sourceLayer: swathLayer.sourceLayer, id: clickedFrame
            }, { click: true });
        }
        setPrevClickedFrame(clickedFrame);
    }, [map, swathLayer, clickedFrame, prevClickedFrame]);

    // Updates map layer paint properties when the user toggles "show downloads". Only in mission pane.
    useEffect(() => {
        if (!map.current || !mission || !swathLayer) return;
        var lineExpr = SWATHS_LINE_COLOR_EXPR_2;
        var fillExpr = SWATHS_FILL_COLOR_EXPR_2;
        if (highlightDownloads) {
            lineExpr = SWATHS_LINE_COLOR_EXPR_1;
            fillExpr = SWATHS_FILL_COLOR_EXPR_1;
        }
        if (map.current.getLayer(swathLayer.lineLayer) && map.current.getLayer(swathLayer.fillLayer)) {
            map.current.setPaintProperty(swathLayer.lineLayer, 'line-color', lineExpr);
            map.current.setPaintProperty(swathLayer.fillLayer, 'fill-color', fillExpr);
        }
    }, [map, mission, swathLayer, highlightDownloads]);

    // Updates the map projection and adjusts zoom level and fog when the user selects a projection
    useEffect(() => {
        if (!map.current) return;
        if(!map.current.isStyleLoaded()) return;
        map.current.setProjection({type: projection});
        map.current.on('zoom', () => {
            if (projection != "globe") {
                return;
            }
        });
    }, [map, projection]);

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