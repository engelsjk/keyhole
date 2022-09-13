import { NextPage } from "next";
import { useEffect, useState } from "react";

import { Box, Typography, TextField, Slider } from '@mui/material';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { InputLabel, FormControl, MenuItem } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import Divider from '@mui/material/Divider';

import Autocomplete from '~/components/styled/Autocomplete';
import Select from '~/components/styled/Select';

import { useAppContext } from "~/context/appContext";

import { MissionData, Mission } from '~/shared/types';
import * as utils from '~/shared/utils';

const DEFAULT_RANGE_ACQUISITION_YEARS = [1960, 1984];

interface Props { }

const FilterPane: NextPage<Props> = (props) => {

    const {
        selectedDesignator,
        setSelectedDesignator,
        selectedResolution,
        setSelectedResolution,
        setSelectedMission,
        rangeAcquisitionYears,
        setRangeAcquisitionYears,
        setSelectedCameraType,
        mission,
        setMission,
        frame,
        setFrame,
        missionData,
    } = useAppContext();

    const [expanded, setExpanded] = useState<boolean>(true);

    const [designatorCanBeFiltered, setDesignatorCanBeFiltered] = useState<boolean>(true);
    const [resolutionCanBeFiltered, setResolutionCanBeFiltered] = useState<boolean>(true);

    const [designatorOptions, setDesignatorOptions] = useState<string[]>([]);
    const [resolutionOptions, setResolutionOptions] = useState<string[]>([]);
    const [missionOptions, setMissionOptions] = useState<MissionData>([]);

    const handleExpanded = (event: React.SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded);
    };

    const handleChangeDesignator = (event: SelectChangeEvent<unknown>) => {

        if (!missionData) return;

        const designator = event.target.value as string;
        setSelectedDesignator(designator);
        designator && resolutionCanBeFiltered ? setDesignatorCanBeFiltered(false) : setDesignatorCanBeFiltered(true);

        var r = selectedResolution;

        var filteredMissionData = designator ?
            missionData.filter(m => { return m.d == designator }) : missionData;

        if (resolutionCanBeFiltered) {
            const resolutionOptions = [...new Set(
                filteredMissionData
                    .sort((a, b) => (a.r > b.r) ? 1 : -1)
                    .map(m => m.r as unknown as string)
            )];
            setResolutionOptions(resolutionOptions);
            r = "";
            setSelectedResolution(r);
        }

        filteredMissionData = r ?
            filteredMissionData.filter(m => { return m.r == Number(selectedResolution) }) : filteredMissionData;

        if (filteredMissionData.length > 0) {

            const earliestMission = filteredMissionData.reduce((prev, current) => {
                return (prev.e < current.e) ? prev : current;
            })
            const latestMission = filteredMissionData.reduce((prev, current) => {
                return (prev.l > current.l) ? prev : current;
            })

            const r = utils.TimestampsToYearRange([earliestMission.e, latestMission.l]);

            setRangeAcquisitionYears(r);
        }
    };

    const handleChangeResolution = (event: SelectChangeEvent<unknown>) => {

        if (!missionData) return;

        const resolution = event.target.value as string;
        setSelectedResolution(resolution);
        resolution && designatorCanBeFiltered ? setResolutionCanBeFiltered(false) : setResolutionCanBeFiltered(true);

        var d = selectedDesignator;

        var filteredMissionData = resolution ?
            missionData.filter(m => { return m.r == Number(resolution) }) : missionData;

        if (designatorCanBeFiltered) {
            const designatorOptions = [...new Set(
                filteredMissionData
                    .sort((a, b) => (a.d > b.d) ? 1 : -1)
                    .map(m => m.d)
            )];
            setDesignatorOptions(designatorOptions);
            d = ""
            setSelectedDesignator(d);
        }

        filteredMissionData = d ?
            filteredMissionData.filter(m => { return m.d == selectedDesignator }) : filteredMissionData;

        if (filteredMissionData.length > 0) {
            const earliestMission = filteredMissionData.reduce((prev, current) => {
                return (prev.e < current.e) ? prev : current;
            })
            const latestMission = filteredMissionData.reduce((prev, current) => {
                return (prev.l > current.l) ? prev : current;
            })

            const r = utils.TimestampsToYearRange([earliestMission.e, latestMission.l]);

            setRangeAcquisitionYears(r);
        }
    };

    const handleChangeRangeAcquisitionYears = (event: Event, newValue: number | number[]) => {

        if (!missionData) return;

        const acquisitionYears = newValue as number[];

        const ts = utils.YearRangeToTimestamps(acquisitionYears);

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

        if (!selectedDesignator) setDesignatorOptions(designatorOptions);
        if (!selectedResolution) setResolutionOptions(resolutionOptions);
        setRangeAcquisitionYears(acquisitionYears);
    };

    const handleChangeMission = (event: React.SyntheticEvent, value: unknown) => {
        const newMission = value as Mission;
        const m: string | null = newMission ? newMission.m : null;
        setSelectedMission(m);
        const mission = missionData?.find((mission) => {
            return mission.m === m;
        });
        if (!mission) {
            setFrame(null);
            setSelectedCameraType("ALL");
        }
        setMission(mission);
    }

    useEffect(() => {
        setExpanded(frame ? false : true);
    }, [frame]);

    useEffect(() => {
        if (!missionData) return;

        const designatorOptions = [...new Set(
            missionData
                .sort((a, b) => (a.d > b.d) ? 1 : -1)
                .map(m => m.d)
        )];
        setDesignatorOptions(designatorOptions);

        const resolutionOptions = [...new Set(
            missionData
                .sort((a, b) => (a.r > b.r) ? 1 : -1)
                .map(m => m.r as unknown as string)
        )];
        setResolutionOptions(resolutionOptions);
    }, [missionData])

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
            sx={{
            }}
        >
            <Accordion
                expanded={expanded}
                onChange={handleExpanded}
                sx={{
                    bgcolor: 'primary.dark',
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                    sx={{ m: 0, backgroundColor: 'primary.dark' }}
                >
                    <Typography
                        color="primary.main"
                        noWrap
                        sx={{ flexGrow: 1, mb: 0 }}
                    >
                        FILTERS
                    </Typography>
                </AccordionSummary>
                <AccordionDetails
                    sx={{
                        color: 'primary.light',
                        bgcolor: 'primary.dark',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <FormControl
                        fullWidth
                        size="small"
                        sx={{
                            mr: 1,
                            mt: 0,
                            mb: 0,
                            maxWidth: 200,
                        }}
                    >
                        <InputLabel
                            sx={{ color: 'primary.light' }}
                        >
                            DESIGNATOR
                        </InputLabel>
                        <Select
                            value={selectedDesignator}
                            label="DESIGNATOR"
                            onChange={handleChangeDesignator}
                            disabled={mission != undefined}
                            MenuProps={{
                                sx: {
                                    "& .MuiMenu-paper": {
                                        color: 'primary.light',
                                        bgcolor: 'primary.dark',
                                    }
                                }
                            }}
                        >
                            <MenuItem value="">
                                <em>---</em>
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
                        sx={{
                            mr: 1,
                            mt: 1.5,
                            mb: 1.5,
                            maxWidth: 200
                        }}
                    >
                        <InputLabel
                            sx={{ color: 'primary.light' }}
                        >
                            RESOLUTION
                        </InputLabel>
                        <Select
                            value={selectedResolution}
                            label="RESOLUTION"
                            onChange={handleChangeResolution}
                            disabled={mission != undefined}
                            MenuProps={{
                                sx: {
                                    "& .MuiMenu-paper": {
                                        color: 'primary.light',
                                        bgcolor: 'primary.dark',
                                    }
                                }
                            }}
                        >
                            <MenuItem value="">
                                <em>---</em>
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

                    <Typography gutterBottom>
                        ACQUISITIONS
                    </Typography>
                    <Typography gutterBottom>
                        {rangeAcquisitionYears && `FROM ${rangeAcquisitionYears[0]} TO ${rangeAcquisitionYears[1]}`}
                    </Typography>
                    <Box
                        sx={{
                            mt: 0,
                            pr: 1,
                            pl: 1,
                            maxWidth: 200
                        }}
                    >
                        {rangeAcquisitionYears &&
                            < Slider
                                getAriaLabel={() => 'ACQUISITIONS'}
                                value={rangeAcquisitionYears}
                                onChange={handleChangeRangeAcquisitionYears}
                                valueLabelDisplay="off"
                                getAriaValueText={utils.TimestampsToDatetime}
                                disabled={mission != undefined}
                                min={DEFAULT_RANGE_ACQUISITION_YEARS[0]}
                                max={DEFAULT_RANGE_ACQUISITION_YEARS[1]}
                            />
                        }
                    </Box>

                    <Divider
                        sx={{
                            mt: 2,
                            mb: 2,
                            width: '50%',
                            borderWidth: 1,
                            bgcolor: 'primary.dark',
                        }}
                    />

                    <Autocomplete
                        size="small"
                        sx={{
                            mt: 1,
                            mb: 1.5,
                            maxWidth: 200,
                            '& + .MuiAutocomplete-popper .MuiAutocomplete-paper': {
                                bgcolor: 'primary.dark',
                                boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
                            },
                            '& + .MuiAutocomplete-popper .MuiAutocomplete-groupLabel': {
                                color: 'primary.main',
                                bgcolor: 'primary.dark',
                            },
                            '& + .MuiAutocomplete-popper .MuiAutocomplete-option': {
                                color: 'primary.light',
                                bgcolor: 'primary.dark',
                            },
                        }}
                        disablePortal
                        options={missionOptions.sort((a, b) => a.d.localeCompare(b.d))}
                        groupBy={(option: unknown) => (option as Mission).d}
                        getOptionLabel={(option: unknown) => (option as Mission).m}
                        onChange={handleChangeMission}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="MISSION"
                            />
                        )}
                    />
                </AccordionDetails>
            </Accordion>
        </Box >
    );
}

export default FilterPane;