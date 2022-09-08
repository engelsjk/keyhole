import { NextPage } from "next";
import { useEffect, useState, ChangeEvent } from "react";

import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { SelectChangeEvent } from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Select from '~/components/styled/Select';

import { useAppContext } from "~/context/appContext";

import * as utils from '~/shared/utils';

type Row = {
    label: string,
    value: string,
};

interface Props { };

const MissionPane: NextPage<Props> = (props) => {

    const {
        selectedCameraType,
        setSelectedCameraType,
        setShowDownloads,
        mission,
    } = useAppContext();

    const [expanded, setExpanded] = useState<boolean>(true);
    const [rows, setRows] = useState<Row[]>([]);

    const handleCameraTypesChange = (event: SelectChangeEvent<unknown>) => {
        setSelectedCameraType(event.target.value as string);
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
            { label: 'DESIGNATOR', value: `${utils.getDesignatorLabel(mission.d)}` },
            { label: 'RESOLUTION', value: `${utils.getResolutionLabel(mission.r)}` },
            { label: 'NUM. FRAMES', value: `${mission.f.toLocaleString('en-US')}` },
            { label: 'EARLIEST ACQUISITION', value: `${utils.TimestampsToDatetime(mission.e)}` },
            { label: 'LATEST ACQUISITION', value: `${utils.TimestampsToDatetime(mission.l)}` },
        ]
        setRows(rows);
    }, [mission]);

    return (
        mission ? (
            <div>
                <Box sx={{
                    flexGrow: 1,
                    mt: 1
                }}
                >
                    <Accordion expanded={expanded} onChange={handleExpanded}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                            sx={{ m: 0, backgroundColor: 'primary.dark' }}
                        >
                            <Typography
                                color="primary.main"
                            >
                                {`MISSION ${mission.m}`}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails
                            sx={{ color: 'primary.light', backgroundColor: 'primary.dark' }}
                        >
                            <TableContainer 
                                component={Paper}
                            >
                                <Table 
                                    size="small"
                                    sx={{ color: 'primary.light', backgroundColor: 'primary.dark' }}

                                >
                                    <TableBody>
                                        {rows.map((row) => (
                                            <TableRow
                                                key={row.label}
                                                sx={{ 
                                                    '&:last-child td, &:last-child th': { border: 0 },
                                                 }}
                                            >
                                                <TableCell 
                                                component="th" 
                                                scope="row"
                                                sx={{ color: 'primary.light' }}
                                                >
                                                    {row.label}
                                                </TableCell>
                                                <TableCell
                                                 align="right"
                                                 sx={{                                              
                                                    color: 'primary.light'
                                                }}
                                                 >{row.value}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Box
                            >
                                <FormControl variant="standard" sx={{ mt: 2, minWidth: 200 }}>
                                    <InputLabel
                                    sx={{ color: 'primary.light' }}
                                    >CAMERA TYPE</InputLabel>
                                    <Select
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