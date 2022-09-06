import { NextPage } from "next";
import { useEffect, useRef, useState, Fragment, useCallback, Dispatch, SetStateAction } from "react";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import Chip from '@mui/material/Chip';

const PROJECTIONS_LIST = [
    { value: 'globe', label: 'GLOBE' },
    { value: 'equalEarth', label: 'EQUAL EARTH' },
    { value: 'albers', label: 'ALBERS' },
    { value: 'mercator', label: 'MERCATOR' },
    { value: 'lambertConformalConic', label: 'LAMBERT CONFORMAL CONIC' },
    { value: 'winkelTripel', label: 'WINKEL TRIPEL' },
    { value: 'naturalEarth', label: 'NATURAL EARTH' },
    { value: 'equirectangular', label: 'EQUIRECTANGULAR' },
];

interface Props {
    projection: string | undefined;
    setProjection: Dispatch<SetStateAction<string | undefined>>;
}

const MapPane: NextPage<Props> = (props) => {

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
                Map
            </Typography>

            <Autocomplete
                size="small"
                sx={{ mr: 1, mb: 1.5, minWidth: 150 }}
                disablePortal
                id="filter-mission"
                options={PROJECTIONS_LIST}
                getOptionLabel={(option) => option.label}
                onChange={(_event, newProjection) => {
                    props.setProjection(newProjection?.value);
                }}
                renderInput={(params) => <TextField {...params} label="Projection" />}
            />

            {props.projection == 'globe' &&
                <Chip label="SPIN GLOBE" />
            }
            <Chip label="LABELS" />
        </Box>
    );
}

export default MapPane;