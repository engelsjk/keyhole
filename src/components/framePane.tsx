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
import Button from '@mui/material/Button';

import { useControl } from "~/context/controlContext";

import { Frame } from '~/shared/types';

interface Props { }

const FramePane: NextPage<Props> = (props) => {

    const {
        frame,
    } = useControl();

    const [expanded, setExpanded] = useState<boolean>(true);

    const handleExpanded = (event: React.SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded);
    };

    return (
        frame ? (
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
                            <Typography>{`FRAME ${frame.e}`}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Chip label={`FRAME ID: ${frame.e}`} />
                            <Chip label={`CAMERA TYPE: ${frame.c}`} />
                            <Chip label={`SEQUENCE/FRAME: ${frame.p}/ ${frame.f}`} />
                            <Chip label={`ACQUISITION DATE: ${DateTime.fromSeconds(frame.d).toLocaleString()}`} />
                            <Chip label={`DOWNLOAD AVAILABLE: ${frame.a}`} />
                            <Button variant="outlined" target="_blank" href={`https://earthexplorer.usgs.gov/scene/metadata/full/${frame.s}/${frame.e}/`}>
                                OPEN USGS METADATA
                            </Button>
                            {/* <FormGroup>
                        <FormControlLabel control={
                            <Switch
                                onChange={handleOpenUSGSMetadataChange}
                            />
                        } label="OPEN USGS METADATA" />
                    </FormGroup> */}
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </div>
        ) : (<div></div>)
    );
}

export default FramePane;