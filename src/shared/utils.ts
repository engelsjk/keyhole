import { DateTime, Interval } from 'luxon';
import { TimeRange } from '~/shared/types';

import { DESIGNATOR_LABELS, RESOLUTION_LABELS, CAMERA_TYPE_LABELS } from '~/components/constants';

export const getDesignatorLabel = (value: string | undefined) => {
    if (!value) {
        return "None";
    }
    const designator = DESIGNATOR_LABELS.find(designator => designator.id == value);
    if (!designator) {
        return "None";
    }
    return designator.label;
}

export const getResolutionLabel = (value: number | undefined) => {
    if (!value) {
        return "None";
    }
    const resolution = RESOLUTION_LABELS.find(resolution => resolution.id == value);
    if (!resolution) {
        return "None";
    }
    return resolution.label_metric;
};

export const getResolutionColor = (value: number | undefined) => {
    if (!value) {
        return "#ffffff";
    }
    const resolution = RESOLUTION_LABELS.find(resolution => resolution.id == value);
    if (!resolution) {
        return "#ffffff";
    }
    return resolution.color;
};

export const getCameraTypeLabel = (value: string | undefined) => {
    if (!value) {
        return "None";
    }
    const camera_type = CAMERA_TYPE_LABELS.find(camera_type => camera_type.id == value);
    if (!camera_type) {
        return "None";
    }
    return camera_type.label;
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
