import { NextPage } from "next";
import { useEffect, useState } from "react";

import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Slider from '@mui/material/Slider';

// import { makeStyles } from "@material-ui/core/styles";

import { useTheme } from '@mui/system';

import { useControl } from "~/context/controlContext";

import { MissionData, Mission, Filters } from '~/shared/types';
import * as utils from '~/shared/utils';

import resolutionIcon from '~/assets/resolution.svg';

type Option = {
    designator: string
    resolution: number
    mission: string
}

interface Props { }

const DEFAULT_RANGE_ACQUISITION_YEARS = [1960, 1984];

const FilterPane: NextPage<Props> = (props) => {

    const theme = useTheme();

    const {
        selectedDesignator,
        setSelectedDesignator,
        selectedResolution,
        setSelectedResolution,
        selectedMission,
        setSelectedMission,
        rangeAcquisitionYears,
        setRangeAcquisitionYears,
        mission,
        setMission,
        setFrame,
        missionData,
    } = useControl();

    // const [options, setOptions] = useState<Option[] | null>([]);
    const [expanded, setExpanded] = useState<boolean>(true);

    const [designatorOptions, setDesignatorOptions] = useState<string[]>([]);
    const [resolutionOptions, setResolutionOptions] = useState<string[]>([]);
    const [missionOptions, setMissionOptions] = useState<MissionData>([]);

    const handleChangeDesignator = (event: SelectChangeEvent) => {
        setSelectedDesignator(event.target.value as string);
    };

    const handleChangeResolution = (event: SelectChangeEvent) => {
        setSelectedResolution(event.target.value);
    };

    const handleChangeMission = (event: SelectChangeEvent) => {
        setSelectedMission(event.target.value as string);
    };

    const handleYearsChange = (event: Event, newValue: number | number[]) => {
        setRangeAcquisitionYears(newValue as number[])
    };

    const handleExpanded = (event: React.SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded);
    };

    useEffect(() => {
        if (!mission) {
            setFrame(null);
        }
    }, [mission]);

    useEffect(() => {
        if (!missionData) return;

        // TODO: fix bad string => number casting!

        var filteredMissionData = selectedDesignator ?
            missionData.filter(m => { return m.d == selectedDesignator }) : missionData;

        const resolutionOptions = [...new Set(
            filteredMissionData
                .sort((a, b) => (a.r > b.r) ? 1 : -1)
                .map(m => m.r as unknown as string)
        )];
        setResolutionOptions(resolutionOptions);

        filteredMissionData = !selectedDesignator && selectedResolution ?
            filteredMissionData.filter(m => { return m.r == Number(selectedResolution) }) : filteredMissionData;

        const earliestMission = filteredMissionData.reduce((prev, current) => {
            return (prev.e < current.e) ? prev : current;
        })
        const latestMission = filteredMissionData.reduce((prev, current) => {
            return (prev.l > current.l) ? prev : current;
        })

        const r = utils.TimestampsToYearRange([earliestMission.e, latestMission.l])
        setRangeAcquisitionYears(r);

    }, [missionData, selectedDesignator]);

    useEffect(() => {
        if (!missionData) return;

        // TODO: fix bad string => number casting!

        var filteredMissionData = selectedResolution ?
            missionData.filter(m => { return m.r == Number(selectedResolution) }) : missionData;

        const designatorOptions = [...new Set(
            filteredMissionData
                .sort((a, b) => (a.d > b.d) ? 1 : -1)
                .map(m => m.d)
        )];
        setDesignatorOptions(designatorOptions);

        filteredMissionData = !selectedResolution && selectedDesignator ?
            filteredMissionData.filter(m => { return m.d == selectedDesignator }) : filteredMissionData;

        const earliestMission = filteredMissionData.reduce((prev, current) => {
            return (prev.e < current.e) ? prev : current;
        })
        const latestMission = filteredMissionData.reduce((prev, current) => {
            return (prev.l > current.l) ? prev : current;
        })

        const r = utils.TimestampsToYearRange([earliestMission.e, latestMission.l])
        setRangeAcquisitionYears(r);

    }, [missionData, selectedResolution]);

    useEffect(() => {
        if (!missionData) return;

        const ts = utils.YearRangeToTimestamps(rangeAcquisitionYears);

        // TODO: fix bad string => number casting!

        var filteredMissionDataForResolution = selectedDesignator ?
            missionData.filter(m => { return m.d == selectedDesignator }) : missionData;

        filteredMissionDataForResolution = !selectedDesignator && !selectedResolution ?
            filteredMissionDataForResolution
                .filter(m => { return m.e >= ts[0] && m.l <= ts[1] }) : filteredMissionDataForResolution;

        const resolutionOptions = [...new Set(
            filteredMissionDataForResolution
                .sort((a, b) => (a.r > b.r) ? 1 : -1)
                .map(m => m.r as unknown as string)
        )];
        setResolutionOptions(resolutionOptions);

        // DESIGNATOR

        var filteredMissionDataForDesignator = selectedResolution ?
            missionData.filter(m => { return m.r == Number(selectedResolution) }) : missionData;

        filteredMissionDataForDesignator = !selectedDesignator && !selectedResolution ?
            filteredMissionDataForDesignator
                .filter(m => { return m.e >= ts[0] && m.l <= ts[1] }) : filteredMissionDataForDesignator;

        const designatorOptions = [...new Set(
            filteredMissionDataForDesignator
                .sort((a, b) => (a.d > b.d) ? 1 : -1)
                .map(m => m.d)
        )];
        setDesignatorOptions(designatorOptions);

    }, [missionData, rangeAcquisitionYears]);

    useEffect(() => {
        if (!missionData) return;

        const ts = utils.YearRangeToTimestamps(rangeAcquisitionYears);

        // TODO: fix bad string => number casting!

        const missionOpts = missionData
            .filter(m => {
                return (
                    (selectedDesignator ? m.d == selectedDesignator : true) &&
                    (selectedResolution ? m.r == selectedResolution as unknown as number : true) &&
                    (rangeAcquisitionYears ? m.e >= ts[0] && m.l <= ts[1] : true)
                )
            })
            .sort((a, b) => (a.m > b.m) ? 1 : -1);
        setMissionOptions(missionOpts);
    }, [missionData, selectedDesignator, selectedResolution, rangeAcquisitionYears]);

    return (

        <Box
            sx={{}}
        >
            <Accordion expanded={expanded} onChange={handleExpanded}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography
                        color="inherit"
                        noWrap
                        sx={{ flexGrow: 1 }}
                    >
                        FILTERS
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormControl
                        fullWidth
                        size="small"
                        sx={{ mr: 1, mt: 1.5, mb: 1.5, maxWidth: 150 }}
                    >
                        <InputLabel id="filter-designator-label">DESIGNATOR</InputLabel>
                        <Select
                            labelId="filter-designator-label"
                            id="filter-designator"
                            value={selectedDesignator}
                            label="DESIGNATOR"
                            onChange={handleChangeDesignator}
                            disabled={mission != undefined}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {
                                designatorOptions.map(d => {
                                    const designator = utils.getDesignatorLabel(d);
                                    return (
                                        <MenuItem key={d} value={d}>{designator}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>

                    <FormControl
                        fullWidth
                        size="small"
                        sx={{ mr: 1, mt: 1, mb: 1.5, maxWidth: 150 }}
                    >
                        <InputLabel id="filter-resolution-label">RESOLUTION</InputLabel>
                        <Select
                            labelId="filter-resolution-label"
                            id="filter-resolution"
                            value={selectedResolution}
                            label="RESOLUTION"
                            onChange={handleChangeResolution}
                            disabled={mission != undefined}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {
                                resolutionOptions.map(r => {
                                    const resolution = utils.getResolutionLabel(Number(r));
                                    return (
                                        <MenuItem key={r} value={r}>{resolution}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>

                    <Typography id="input-slider" gutterBottom>
                        ACQUISITIONS
                    </Typography>
                    <Typography id="input-slider" gutterBottom>
                        {rangeAcquisitionYears && `FROM ${rangeAcquisitionYears[0]} TO ${rangeAcquisitionYears[1]}`}
                    </Typography>
                    <Box
                        sx={{ mt: 0, pr: 1, pl: 1, maxWidth: 200 }}
                    >
                        {rangeAcquisitionYears &&
                            < Slider
                                getAriaLabel={() => 'ACQUISITIONS'}
                                value={rangeAcquisitionYears}
                                onChange={handleYearsChange}
                                valueLabelDisplay="off"
                                getAriaValueText={utils.TimestampsToDatetime}
                                disabled={mission != undefined}
                                min={DEFAULT_RANGE_ACQUISITION_YEARS[0]}
                                max={DEFAULT_RANGE_ACQUISITION_YEARS[1]}
                            />
                        }
                    </Box>

                    <Autocomplete
                        size="small"
                        sx={{ mt: 1, mb: 1.5, maxWidth: 150 }}
                        disablePortal
                        id="filter-mission"
                        options={missionOptions.sort((a, b) => a.d.localeCompare(b.d))}
                        groupBy={(option) => option.d}
                        getOptionLabel={(option) => option.m}
                        isOptionEqualToValue={(option, value) => option.m == value.m}
                        onChange={(_event, newMission) => {
                            const m: string | null = newMission ? newMission.m : null;
                            setSelectedMission(m);
                            const mission = missionData?.find((mission) => {
                                return mission.m === m;
                            });
                            setMission(mission)
                        }}
                        renderInput={(params) => <TextField {...params} label="MISSION" />}
                    />
                </AccordionDetails>
            </Accordion>
        </Box >
    );
}

export default FilterPane;