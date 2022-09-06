import { NextPage } from "next";
import { useEffect, useRef, useState, ChangeEvent, Fragment, useCallback, Dispatch, SetStateAction } from "react";
import { DateTime } from 'luxon';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import { Mission } from '~/shared/types';

interface Props {
    mission: Mission;
};

const MissionPane: NextPage<Props> = (props) => {

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
                {`MISSION ${props.mission.m}`}
            </Typography>
            <Chip label={`DESIGNATOR: ${props.mission.d}`} />
            <Chip label={`RESOLUTION: ${props.mission.r}`} />
            <Chip label={`NUM. FRAMES: ${props.mission.f}`} />
            <Chip label={`EARLIEST ACQUISITION: ${DateTime.fromSeconds(props.mission.e).toLocaleString()}`} />
            <Chip label={`LATEST ACQUISITION: ${DateTime.fromSeconds(props.mission.l).toLocaleString()}`} />
        </Box>
    );
}

export default MissionPane;