import { DateTime, Interval } from 'luxon';
import { TimeRange } from '~/shared/types';

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

export const TimestampsToDatetime = (ts: number): string => {
    const dt = DateTime.fromSeconds(ts, { zone: 'utc' })
    return `${dt.toFormat('yyyy-MM-dd')}`;
}

export const TimestampsToTimerange = (ts: number[], units: string): TimeRange => {
    if (!(units == 'months' || units == 'years')) {
        return {
            range: [0, 0],
        } as TimeRange;
    }

    const e = DateTime.fromSeconds(ts[0], { zone: 'utc' });
    const l = DateTime.fromSeconds(ts[1], { zone: 'utc' });
    const i = Interval.fromDateTimes(e, l);

    var d = i.count(units) - 1;

    return {
        interval: i,
        range: [0, d],
        units: units,
    };
}

export const RangeToTimestamps = (r: number[], tr: TimeRange): number[] => {
    if (tr.units == 'months') {
        const from = tr.interval.start.plus({ months: r[0] }).startOf('month');
        const to = tr.interval.start.plus({ months: r[1] }).endOf('month');
        return [from.toSeconds(), to.toSeconds()];
    }

    if (tr.units == 'years') {
        const from = tr.interval.start.plus({ years: r[0] }).startOf('year');
        const to = tr.interval.start.plus({ years: r[1] }).set({ 'month': tr.interval.end.get('month') }).endOf('year');
        return [from.toSeconds(), to.toSeconds()];
    }
    return [0, 0];
}

export const TimesToString = (ts: number[], tr: TimeRange): string => {
    if (tr.units == 'months') {
        const from = tr.interval.start.plus({ months: ts[0] });
        const to = tr.interval.start.plus({ months: ts[1] });
        return `FROM ${from.toFormat('yyyy-MM')} TO ${to.toFormat('yyyy-MM')}`;
    }

    if (tr.units == 'years') {
        const from = tr.interval.start.plus({ years: ts[0] });
        const to = tr.interval.start.plus({ years: ts[1] });
        return `FROM ${from.toFormat('yyyy')} TO ${to.toFormat('yyyy')}`;
    }

    return '';
}
