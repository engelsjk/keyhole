import { NextPage } from "next";
import { useEffect, useState, ChangeEvent } from "react";
import { DateTime } from 'luxon';

import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
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
            { label: 'CAMERA TYPE', value: `${utils.getCameraTypeLabel(frame.c)}` },
            { label: 'SEQUENCE/FRAME', value: `${frame.p}/ ${frame.f}` },
            { label: 'ACQUISITION DATE', value: `${DateTime.fromSeconds(frame.d).toLocaleString()}` },
            { label: 'DOWNLOAD AVAILABLE', value: ` ${frame.a}` },
        ]
        setRows(rows);

        const href = `https://earthexplorer.usgs.gov/scene/metadata/full/${frame.s}/${frame.e}/`;

        // TODO: validate href!

        setLink(href);

    }, [frame]);

    return (
        frame ? (
            <div>
                <Box sx={{
                    flexGrow: 1,
                    mt: 1
                }}
                >
                    <Accordion
                        expanded={expanded}
                        onChange={handleExpanded}
                        sx={{}}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>{`FRAME ${frame.e}`}</Typography>
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
                            {link != '' &&
                                <Button
                                    sx={{
                                        mt: 2,
                                        bgcolor: 'primary.dark',
                                    }}
                                    variant="outlined"
                                    target="_blank"
                                    href={link}>
                                    OPEN USGS METADATA
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