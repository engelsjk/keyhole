import { DateTime } from 'luxon';

export const getDesignatorLabel = (value: string | undefined) => {
    if (!value) {
        return "None";
    }
    const labels: { [key: string]: string } = {
        'KH-1': 'KH-1 CORONA',
        'KH-2': 'KH-2 CORONA',
        'KH-3': 'KH-3 CORONA',
        'KH-4': 'KH-4 CORONA',
        'KH-4A': 'KH-4A CORONA',
        'KH-4B': 'KH-4B CORONA',
        'KH-5': 'KH-5 ARGON',
        'KH-6': 'KH-6 LANYARD',
        'KH-7': 'KH-7 GAMBIT',
        'KH-9': 'KH-9 HEXAGON',
    }
    return labels[value];
}

export const getResolutionLabel = (value: number | undefined) => {
    if (!value) {
        return "None";
    }
    const labels: { [key: number]: string } = {
        1: '0.6 to 1.2 m',
        2: '1.8 m',
        3: '2.7 m',
        4: '6.1 to 9.1 m',
        5: '7.6 m',
        6: '9.1 m',
        7: '12.2 m',
        8: '140.2 m'
    }
    return labels[value];
};

export const range2time = (r: number[] | null) => {
    if (!r) {
        return [];
    }
    const e = DateTime.fromFormat(`${r[0].toString()}-01-01`, 'yyyy-MM-dd').toSeconds();
    const l = DateTime.fromFormat(`${r[1].toString()}-12-31`, 'yyyy-MM-dd').toSeconds();
    return ([e, l])
}

export const time2range = (t: number[] | null) => {
    if (!t) {
        return [];
    }
    const e = DateTime.fromSeconds(t[0]).get('year');
    const l = DateTime.fromSeconds(t[1]).get('year');
    return ([e, l])
}

// export const arrayEquals = (a: any, b: any) => {
//     return Array.isArray(a) &&
//         Array.isArray(b) &&
//         a.length === b.length &&
//         a.every((val, index) => val === b[index]);
// }