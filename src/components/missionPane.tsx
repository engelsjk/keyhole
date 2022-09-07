import { NextPage } from "next";
import { useEffect, useRef, useState, ChangeEvent, Fragment, useCallback, Dispatch, SetStateAction } from "react";
import { DateTime } from 'luxon';

import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { useControl } from "~/context/controlContext";

import { Mission } from '~/shared/types';

const CAMERA_TYPES = {
    "A": "AFT PANORAMIC",
    "F": "FORWARD PANORAMIC",
    "C": "MAPPING",
    "V": "VERTICAL",
    "M": "MAPPING",
    "S": "SURVEILLANCE"
};

function hasKey<O>(obj: O, key: PropertyKey): key is keyof O {
    return key in obj
}

interface Props {
};

const MissionPane: NextPage<Props> = (props) => {

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

    const [expanded, setExpanded] = useState<boolean>(true);

    const handleCameraTypesChange = (event: SelectChangeEvent) => {
        setSelectedCameraType(event.target.value);
    };

    const handleShowDownloadsChange = (event: ChangeEvent<HTMLInputElement>) => {
        setShowDownloads(event.target.checked);
    };


    const handleExpanded = (event: React.SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded);
    };

    return (
        mission ? (
            <div>
                <Box sx={{
                    flexGrow: 1,
                    borderStyle: 'solid',
                    borderColor: 'black',
                    p: 1
                }}
                    bgcolor='primary.main'
                >
                    <Accordion expanded={expanded} onChange={handleExpanded}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography> {`MISSION ${mission.m}`}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Chip label={`DESIGNATOR: ${mission.d}`} />
                            <Chip label={`RESOLUTION: ${mission.r}`} />
                            <Chip label={`NUM. FRAMES: ${mission.f}`} />
                            <Chip label={`EARLIEST ACQUISITION: ${DateTime.fromSeconds(mission.e).toLocaleString()}`} />
                            <Chip label={`LATEST ACQUISITION: ${DateTime.fromSeconds(mission.l).toLocaleString()}`} />

                            <Box
                            >
                                <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
                                    <InputLabel id="select-camera-type-label">CAMERA TYPE</InputLabel>
                                    <Select
                                        labelId="select-camera-type"
                                        id="select-camera-type"
                                        value={selectedCameraType ? selectedCameraType : "ALL"}
                                        onChange={handleCameraTypesChange}
                                        label="CAMERA TYPES"
                                    >
                                        <MenuItem value="ALL">
                                            <em>ALL</em>
                                        </MenuItem>
                                        {
                                            mission.c.map(c => {
                                                var cameraType = "UNKNOWN";
                                                if (hasKey(CAMERA_TYPES, c)) {
                                                    cameraType = CAMERA_TYPES[c] // works fine!
                                                }
                                                return (
                                                    <MenuItem key={c} value={c}>{cameraType}</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                                <FormGroup>
                                    <FormControlLabel control={
                                        <Switch
                                            defaultChecked
                                            onChange={handleShowDownloadsChange}
                                        />
                                    } label="SHOW DOWNLOADS" />
                                </FormGroup>
                            </Box>
                        </AccordionDetails>
                    </Accordion >
                </Box >
            </div >
        ) : (<div></div>)
    );
}

export default MissionPane;