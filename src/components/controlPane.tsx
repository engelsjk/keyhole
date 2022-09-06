import { NextPage } from "next";
import { useEffect, useRef, useState, ChangeEvent, Fragment, useCallback, Dispatch, SetStateAction } from "react";
import { DateTime } from 'luxon';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Slider from '@mui/material/Slider';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { MissionData, Mission, Filters } from '~/shared/types';
import * as utils from '~/shared/utils';

import resolutionIcon from '~/assets/resolution.svg';

const CAMERA_TYPES = {
    "A": "AFT PANORAMIC",
    "F": "FORWARD PANORAMIC",
    "C": "MAPPING",
    "V": "VERTICAL",
    "M": "MAPPING",
    "S": "SURVEILLANCE"
};

interface Props {
    missionData: MissionData | null
    filters: Filters;
    setFilters: Dispatch<SetStateAction<Filters>>
    setFrame: Dispatch<SetStateAction<string | null>>;
    setMission: Dispatch<SetStateAction<Mission | undefined>>;
}

const ts2dt = (ts: number): string => {
    const dt = DateTime.fromSeconds(ts)
    return `${dt.toLocaleString()}`;
}

const ControlPane: NextPage<Props> = (props) => {

    const [cameraType, setCameraType] = useState<string>('ALL');
    const [cameraTypes, setCameraTypes] = useState<string | undefined>(undefined);
    const [showFrame, setShowFrame] = useState<boolean>(false);

    const handleYearsChange = (event: Event, newValue: number | number[]) => {
        props.setFilters(prevFilters => ({
            ...prevFilters,
            years: newValue as number[]
        }));
    };

    const handleCameraTypesChange = (event: SelectChangeEvent) => {
        setCameraType(event.target.value);
    };

    const handleShowDownloadsChange = (event: ChangeEvent<HTMLInputElement>) => {
        console.log(`show_downloads: ${event.target.checked}`);
    };

    const handleShowFrameChange = (event: ChangeEvent<HTMLInputElement>) => {
        console.log(`show_frame: ${event.target.checked}`);
        setShowFrame(event.target.checked);
    };

    const handleOpenUSGSMetadataChange = (event: ChangeEvent<HTMLInputElement>) => {
        console.log(`open_usgs_metadata: ${event.target.checked}`);
    };

    const options = props.missionData ? props.missionData.map((option) => {
        return {
            designator: option.d,
            mission: option.m,
            resolution: option.r,
        };
    }) : [{ designator: 'none', resolution: 0, mission: 'none' }];

    useEffect(() => {
        console.log("props.filters.mission_showFrame")
        props.filters.mission && showFrame ? props.setFrame('123') : props.setFrame(null);
    }, [props.filters.mission, showFrame])

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
                    props.setFilters(prevFilters => ({
                        ...prevFilters,
                        designator: newDesignator as string | null
                    }));
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
                    props.setFilters(prevFilters => ({
                        ...prevFilters,
                        resolution: newResolution as number | null
                    }));
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
                    const m: string | null = newMission ? newMission.mission : null; // props.setMission(newMission.mission) : props.setMission(null)
                    props.setFilters(prevFilters => ({
                        ...prevFilters,
                        mission: m
                    }))

                    const selectedMission = props.missionData?.find((mission) => {
                        return mission.m === m;
                    });
                    props.setMission(selectedMission);
                }}
                renderInput={(params) => <TextField {...params} label="MISSION" />}
            />

            <Typography id="input-slider" gutterBottom>
                ACQUISITION YEARS
            </Typography>
            <Box
                sx={{ mt: 4, p: 2.25 }}
            >
                {props.filters.years &&
                    < Slider
                        getAriaLabel={() => 'Acquisition Years'}
                        value={props.filters.years}
                        onChange={handleYearsChange}
                        valueLabelDisplay="on"
                        getAriaValueText={ts2dt}
                        min={1960}
                        max={1984}
                    />
                }
            </Box>
            {props.filters.mission &&
                <Box
                >
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
                        <InputLabel id="select-camera-type-label">CAMERA TYPE</InputLabel>
                        <Select
                            labelId="select-camera-type"
                            id="select-camera-type"
                            value={cameraType}
                            onChange={handleCameraTypesChange}
                            label="CAMERA TYPES"
                        >
                            <MenuItem value="ALL">
                                <em>ALL</em>
                            </MenuItem>
                            <MenuItem value={'A'}>AFT PANORAMIC</MenuItem>
                            <MenuItem value={'F'}>FORWARD PANORAMIC</MenuItem>
                        </Select>
                    </FormControl>
                    <FormGroup>
                        <FormControlLabel control={
                            <Switch
                                onChange={handleShowDownloadsChange}
                            />
                        } label="SHOW DOWNLOADS" />
                    </FormGroup>
                    <FormGroup>
                        <FormControlLabel control={
                            <Switch
                                onChange={handleShowFrameChange}
                            />
                        } label="SHOW FRAME (X)" />
                    </FormGroup>
                    <FormGroup>
                        <FormControlLabel control={
                            <Switch
                                onChange={handleOpenUSGSMetadataChange}
                            />
                        } label="OPEN USGS METADATA" />
                    </FormGroup>
                </Box>
            }
        </Box>
    );
}

export default ControlPane;