import { NextPage } from "next";
import { useEffect, useRef, useState, ChangeEvent, Fragment, useCallback, Dispatch, SetStateAction } from "react";
import { DateTime } from 'luxon';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Slider from '@mui/material/Slider';

import { useControl } from "~/context/controlContext";

import { MissionData, Mission, Filters } from '~/shared/types';
import * as utils from '~/shared/utils';

import resolutionIcon from '~/assets/resolution.svg';



interface Props {
    missionData: MissionData | null
}

const ts2dt = (ts: number): string => {
    const dt = DateTime.fromSeconds(ts)
    return `${dt.toLocaleString()}`;
}

const ControlPane: NextPage<Props> = (props) => {

    const {
        selectedDesignator,
        setSelectedDesignator,
        selectedResolution,
        setSelectedResolution,
        selectedMission,
        setSelectedMission,
        rangeAcquisitionYears,
        setRangeAcquisitionYears,
        selectedCameraType,
        setSelectedCameraType,
        showDownloads,
        setShowDownloads,
        mission,
        setMission,
    } = useControl();

    const handleYearsChange = (event: Event, newValue: number | number[]) => {
        setRangeAcquisitionYears(newValue as number[])
    };

    const options = props.missionData ? props.missionData.map((option) => {
        return {
            designator: option.d,
            mission: option.m,
            resolution: option.r,
        };
    }) : [{ designator: 'none', resolution: 0, mission: 'none' }];

    return (
        <Box sx={{
            flexGrow: 1,
            borderStyle: 'solid',
            borderColor: 'black',
            p: 1
        }}>
            <Typography
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
            >
                FILTERS
            </Typography>
            <Autocomplete
                size="small"
                sx={{ mr: 1, mt: 1, mb: 1.5, minWidth: 200 }}
                disablePortal
                id="filter-designator"
                options={[...new Set(options.map(opt => opt.designator))].sort()}
                getOptionLabel={(option) => utils.getDesignatorLabel(option)}
                onChange={(_event, newDesignator) => {
                    setSelectedDesignator(newDesignator);
                }}
                renderInput={(params) => <TextField {...params} label="DESIGNATOR" />}
            />

            <Autocomplete
                size="small"
                sx={{ mr: 1, mb: 1.5, minWidth: 150 }}
                disablePortal
                id="filter-resolution"
                options={[...new Set(options.map(opt => opt.resolution))].sort()}
                getOptionLabel={(option) => utils.getResolutionLabel(option)}
                onChange={(_event, newResolution) => {
                    setSelectedResolution(newResolution);

                }}
                renderInput={(params) => <TextField {...params} label="RESOLUTION" />}
            />

            <Autocomplete
                size="small"
                sx={{ mr: 1, mb: 1.5, minWidth: 150 }}
                disablePortal
                id="filter-mission"
                options={options.sort((a, b) => a.designator.localeCompare(b.designator))}
                groupBy={(option) => option.designator}
                getOptionLabel={(option) => option.mission}
                isOptionEqualToValue={(option, value) => option.mission == value.mission}
                onChange={(_event, newMission) => {
                    console.log('onChange')
                    const m: string | null = newMission ? newMission.mission : null; // props.setMission(newMission.mission) : props.setMission(null)
                    setSelectedMission(m);
                    const mission = props.missionData?.find((mission) => {
                        return mission.m === m;
                    });
                    setMission(mission)
                }}
                renderInput={(params) => <TextField {...params} label="MISSION" />}
            />

            <Typography id="input-slider" gutterBottom>
                ACQUISITION YEARS
            </Typography>
            <Box
                sx={{ mt: 4, p: 2.25 }}
            >
                {rangeAcquisitionYears &&
                    < Slider
                        getAriaLabel={() => 'Acquisition Years'}
                        value={rangeAcquisitionYears}
                        onChange={handleYearsChange}
                        valueLabelDisplay="on"
                        getAriaValueText={ts2dt}
                        min={1960}
                        max={1984}
                    />
                }
            </Box>
        </Box>
    );
}

export default ControlPane;