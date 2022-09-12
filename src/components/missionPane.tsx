import { NextPage } from "next";
import { useEffect, useState, ChangeEvent } from "react";

import { Box, Switch, Typography } from '@mui/material';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FormGroup, FormControlLabel, InputLabel, FormControl, MenuItem } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import Paper from '@mui/material/Paper';

import Select from '~/components/styled/Select';

import { useAppContext } from "~/context/appContext";

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
            { label: 'MISSION', value: `${mission.m}` },
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
                    mt: 1
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
                            >
                                MISSION
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails
                            sx={{
                                color: 'primary.light',
                                backgroundColor: 'primary.dark'
                            }}
                        >
                            <TableContainer
                                component={Paper}
                                sx={{
                                    backgroundColor: 'transparent',
                                }}
                            >
                                <Table
                                    size="small"
                                    sx={{
                                        color: 'primary.light',
                                        backgroundColor: 'primary.dark',
                                    }}

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
                                                    sx={{ color: 'primary.light' }}
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
                                        MenuProps={{
                                            sx: {
                                                "& .MuiMenu-paper": {
                                                    color: 'primary.light',
                                                    bgcolor: 'primary.dark',
                                                }
                                            }
                                        }}
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