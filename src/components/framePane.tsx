import { NextPage } from "next";
import { useEffect, useRef, useState, ChangeEvent, Fragment, useCallback, Dispatch, SetStateAction } from "react";
import { DateTime } from 'luxon';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import { Frame } from '~/shared/types';

interface Props {
    frame: Frame;
}

const FramePane: NextPage<Props> = (props) => {

    const handleOpenUSGSMetadataChange = (event: ChangeEvent<HTMLInputElement>) => {
        console.log(`open_usgs_metadata: ${event.target.checked}`);
    };

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
                FRAME
            </Typography>
            <Chip label={`FRAME ID: ${props.frame.e}`} />
            <Chip label={`CAMERA TYPE: ${props.frame.c}`} />
            <Chip label={`SEQUENCE/FRAME: ${props.frame.p}/ ${props.frame.f}`} />
            <Chip label={`ACQUISITION DATE: ${DateTime.fromSeconds(props.frame.d).toLocaleString()}`} />
            <Chip label={`DOWNLOAD AVAILABLE: ${props.frame.a}`} />
            <FormGroup>
                <FormControlLabel control={
                    <Switch
                        onChange={handleOpenUSGSMetadataChange}
                    />
                } label="OPEN USGS METADATA" />
            </FormGroup>
        </Box>
    );
}

export default FramePane;