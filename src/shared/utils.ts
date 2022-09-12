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

export const getCameraTypeLabel = (value: string | undefined) => {
    if (!value) {
        return "None";
    }
    const labels: { [key: string]: string } = {
        "A": "AFT PANORAMIC",
        "F": "FORWARD PANORAMIC",
        "C": "MAPPING",
        "V": "VERTICAL",
        "M": "MAPPING",
        "S": "SURVEILLANCE"
    }
    return labels[value];
};

export const YearRangeToTimestamps = (r: number[] | null) => {
    if (!r) {
        return [];
    }
    const e = DateTime.fromFormat(`${r[0].toString()}-01-01`, 'yyyy-MM-dd', { zone: 'utc' }).toSeconds();
    const l = DateTime.fromFormat(`${r[1].toString()}-12-31`, 'yyyy-MM-dd', { zone: 'utc' }).toSeconds();
    return ([e, l])
}

export const DayRangeToTimestamps = (s: number, r: number[] | null) => {
    if (!r) {
        return [];
    }
    const dt = DateTime.fromSeconds(s, { zone: 'utc' });
    const e = dt.plus({ days: r[0] }).toSeconds();
    const l = dt.plus({ days: r[1] }).toSeconds();
    return ([e, l])
}

export const TimestampsToYearRange = (ts: number[] | null) => {
    if (!ts) {
        return [];
    }
    const e = DateTime.fromSeconds(ts[0], { zone: 'utc' }).get('year');
    const l = DateTime.fromSeconds(ts[1], { zone: 'utc' }).get('year');
    return ([e, l])
}

export const TimestampsToDatetime = (ts: number): string => {
    const dt = DateTime.fromSeconds(ts, { zone: 'utc' })
    return `${dt.toFormat('yyyy-MM-dd')}`;
}

export const TimestampsDaysDiff = (ts: number[]) => {
    const e = DateTime.fromSeconds(ts[0], { zone: 'utc' });
    const l = DateTime.fromSeconds(ts[1], { zone: 'utc' });
    return e.diff(l, ['days']).get('days');
}
