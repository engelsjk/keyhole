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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { useControl } from "~/context/controlContext";

import { Mission } from '~/shared/types';
import * as utils from '~/shared/utils';

type Row = {
    label: string,
    value: string,
};

interface Props {
};

const MissionPane: NextPage<Props> = (props) => {

    const {
        selectedCameraType,
        setSelectedCameraType,
        setShowDownloads,
        mission,
        setMission,
    } = useControl();

    const [expanded, setExpanded] = useState<boolean>(true);
    const [rows, setRows] = useState<Row[]>([]);

    const handleCameraTypesChange = (event: SelectChangeEvent) => {
        setSelectedCameraType(event.target.value);
    };

    const handleShowDownloadsChange = (event: ChangeEvent<HTMLInputElement>) => {
        setShowDownloads(event.target.checked);
    };

    const handleExpanded = (event: React.SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded);
    };

    useEffect(() => {
        if (!mission) return;
        const rows: Row[] = [
            { label: 'NUM. FRAMES', value: `${mission.f}` },
            { label: 'EARLIEST ACQUISITION', value: `${DateTime.fromSeconds(mission.e).toLocaleString()}` },
            { label: 'LATEST ACQUISITION', value: `${DateTime.fromSeconds(mission.l).toLocaleString()}` },
        ]
        setRows(rows);
    }, [mission]);

    return (
        mission ? (
            <div>
                <Box sx={{
                    flexGrow: 1,
                    mt: 1
                    // borderStyle: 'solid',
                    // borderColor: 'black',
                    // p: 1
                }}
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
                            <TableContainer component={Paper}>
                                <Table size="small" aria-label="a dense table">
                                    <TableBody>
                                        {rows.map((row) => (
                                            <TableRow
                                                key={row.label}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.label}
                                                </TableCell>
                                                <TableCell align="right">{row.value}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Box
                            >
                                <FormControl variant="standard" sx={{ mt: 2, minWidth: 200 }}>
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
                                                const cameraType = utils.getCameraTypeLabel(c);
                                                return (
                                                    <MenuItem key={c} value={c}>{cameraType}</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                                <FormGroup sx={{ mt: 1 }}>
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