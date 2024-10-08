import { NextPage } from "next";
import { useEffect, useState, ChangeEvent } from "react";
import { DateTime } from 'luxon';

import { Box, Typography, Button } from '@mui/material';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';

import { useAppContext } from "~/context/appContext";

import * as utils from '~/shared/utils';

type Row = {
    label: string,
    value: string,
};

interface Props { }

const FramePane: NextPage<Props> = (props) => {

    const {
        frame,
    } = useAppContext();

    const [expanded, setExpanded] = useState<boolean>(true);
    const [rows, setRows] = useState<Row[]>([]);

    const [link, setLink] = useState<string>('');

    const handleExpanded = (event: React.SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded);
    };

    useEffect(() => {

        if (!frame) return;
        const rows: Row[] = [
            { label: 'FRAME', value: `${frame.e}` },
            { label: 'CAMERA TYPE', value: `${utils.getCameraTypeLabel(frame.c)}` },
            { label: 'SEQUENCE/FRAME', value: `${frame.p}/ ${frame.f}` },
            { label: 'ACQUISITION DATE', value: `${utils.TimestampsToDatetime(frame.d)}` },
            { label: 'DOWNLOAD AVAILABLE', value: ` ${frame.a}` },
        ]
        setRows(rows);

        // Issue: https://github.com/engelsjk/keyhole/issues/1
        // There was a bug in the processing code, which caused the `frame.s` values in the tile sets
        // to be incorrect, breaking most of these metadata links. In lieu of updating the tile sets, 
        // this is a quick fix to dynamically lookup the dataset id by mission id to set the metadata 
        // href links. This might be a better approach overall as it would allow a mostly repetitive
        // field to be removed from the tiles.
        const dataset_id = utils.getDatasetIdByMissionId(frame.m);
        const href = dataset_id ? `https://earthexplorer.usgs.gov/scene/metadata/full/${dataset_id}/${frame.e}/` : '';  
        setLink(href);
    }, [frame]);

    return (
        frame ? (
            <div>
                <Box sx={{
                    mt: 1,
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
                            expandIcon={<ExpandMoreIcon sx={{
                                color: 'primary.main'
                            }} />}
                            sx={{
                                m: 0,
                                backgroundColor: 'primary.dark'
                            }}
                        >
                            <Typography
                                color="primary.main"
                            >
                                FRAME
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
                                                    '&:last-child td, &:last-child th': { border: 0 }
                                                }}
                                            >
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    sx={{
                                                        color: 'primary.light'
                                                    }}
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
                            {link != '' &&
                                <Button
                                    sx={{
                                        mt: 2,
                                        color: 'primary.dark',
                                        "&:hover": {
                                            color: 'primary.main',
                                        },
                                    }}
                                    variant="contained"
                                    target="_blank"
                                    href={link}>
                                    GO TO USGS METADATA
                                </Button>
                            }
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </div >
        ) : (<div></div>)
    );
}

export default FramePane;