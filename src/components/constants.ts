import { Projection } from '~/shared/types';

export const MAP_TILE_URLS = [
    'https://djellr4yg949p.cloudfront.net/keyhole/v1',
    'https://d8it8dv6zj2fq.cloudfront.net/keyhole/v1'
];

export const DESIGNATOR_LABELS = [
    { id: 'KH-1', label: 'KH-1 CORONA' },
    { id: 'KH-2', label: 'KH-2 CORONA' },
    { id: 'KH-3', label: 'KH-3 CORONA' },
    { id: 'KH-4', label: 'KH-4 CORONA' },
    { id: 'KH-4A', label: 'KH-4A CORONA' },
    { id: 'KH-4B', label: 'KH-4B CORONA' },
    { id: 'KH-5', label: 'KH-5 ARGON' },
    { id: 'KH-6', label: 'KH-6 LANYARD' },
    { id: 'KH-7', label: 'KH-7 GAMBIT' },
    { id: 'KH-9', label: 'KH-9 HEXAGON' },
];

export const RESOLUTION_LABELS = [
    { id: 1, color: '#cb2d2e', label_metric: '0.6-1.2 m', label_imperial: '2-4 ft', systems: 'KH-7 GAMBIT, KH-9 HEXAGON' },
    { id: 2, color: '#e47fa9', label_metric: '1.8 m', label_imperial: '6 ft', systems: 'KH-4B CORONA, KH-6 LANYARD' },
    { id: 3, color: '#88d27d', label_metric: '2.7 m', label_imperial: ' 9 ft', systems: 'KH-4A CORONA' },
    { id: 4, color: '#3295cc', label_metric: '6.1-9.1 m', label_imperial: '20-30 ft', systems: 'KH-9 HEXAGON (Mapping)' },
    { id: 5, color: '#e2ba7d', label_metric: '7.6 m', label_imperial: '25 ft', systems: 'KH-3 CORONA, KH-4 CORONA' },
    { id: 6, color: '#da8451', label_metric: '9.1 m', label_imperial: '30 ft', systems: 'KH-2 CORONA' },
    { id: 7, color: '#8e503b', label_metric: '12.2 m', label_imperial: '40 ft', systems: 'KH-1 CORONA' },
    { id: 8, color: '#463c3a', label_metric: '140.2 m', label_imperial: '460 ft', systems: 'KH-5 ARGON' },
];

export const CAMERA_TYPE_LABELS = [
    { id: "A", label: "AFT PANORAMIC" },
    { id: "F", label: "FORWARD PANORAMIC" },
    { id: "C", label: "MAPPING" },
    { id: "V", label: "VERTICAL" },
    { id: "M", label: "MAPPING" },
    { id: "S", label: "SURVEILLANCE" },
];

export const PROJECTION_OPTIONS: Projection[] = [
    { id: 'globe', name: 'GLOBE' },
    { id: 'equalEarth', name: 'EQUAL EARTH' },
    { id: 'albers', name: 'ALBERS' },
    { id: 'mercator', name: 'MERCATOR' },
    { id: 'lambertConformalConic', name: 'LAMBERT CONFORMAL CONIC' },
    { id: 'winkelTripel', name: 'WINKEL TRIPEL' },
    { id: 'naturalEarth', name: 'NATURAL EARTH' },
    { id: 'equirectangular', name: 'EQUIRECTANGULAR' },
];
