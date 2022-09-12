import { NextPage } from "next";
import { useEffect, useState, ChangeEvent } from "react";

import { Box, Typography, Button, Switch } from '@mui/material';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { InputLabel, FormControl, FormGroup, FormControlLabel, MenuItem } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

import Select from '~/components/styled/Select';

import { useAppContext } from "~/context/appContext";

import { MissionData, Mission, Projection } from '~/shared/types';
import * as utils from '~/shared/utils';

const PROJECTION_OPTIONS: Projection[] = [
    { id: 'globe', name: 'GLOBE' },
    { id: 'equalEarth', name: 'EQUAL EARTH' },
    { id: 'albers', name: 'ALBERS' },
    { id: 'mercator', name: 'MERCATOR' },
    { id: 'lambertConformalConic', name: 'LAMBERT CONFORMAL CONIC' },
    { id: 'winkelTripel', name: 'WINKEL TRIPEL' },
    { id: 'naturalEarth', name: 'NATURAL EARTH' },
    { id: 'equirectangular', name: 'EQUIRECTANGULAR' },
];

interface Props { }

const MapPane: NextPage<Props> = (props) => {

    const {
        projection,
        setProjection
    } = useAppContext();

    const [expanded, setExpanded] = useState<boolean>(false);
    const [spinGlobe, setSpinGlobe] = useState<boolean>(false);

    const toggleSpinGlobe = () => {
        setSpinGlobe(v => !v);
    }
    const handleExpanded = (event: React.SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded);
    };

    const handleChangeProjection = (event: SelectChangeEvent<unknown>) => {
        const proj = event.target.value as string;
        setProjection(proj);
    }

    const handleShowLabels = (event: ChangeEvent<HTMLInputElement>) => {
        const showLabels = event.target.checked;
        console.log(`labels: ${showLabels}`);
    };

    return (
        <Box
            sx={{
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
                    expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                    sx={{ m: 0, backgroundColor: 'primary.dark' }}
                >
                    <Typography
                        color="primary.main"
                        noWrap
                        sx={{ flexGrow: 1, mb: 0 }}
                    >
                        MAP
                    </Typography>
                </AccordionSummary>
                <AccordionDetails
                    sx={{ color: 'primary.light', backgroundColor: 'primary.dark' }}
                >
                    <FormControl
                        fullWidth
                        size="small"
                        sx={{
                            mb: 1.5,
                            maxWidth: 300,
                        }}
                    >
                        <InputLabel
                            sx={{ color: 'primary.light' }}
                        >
                            PROJECTION
                        </InputLabel>
                        <Select
                            value={projection}
                            label="PROJECTION"
                            onChange={handleChangeProjection}
                        >
                            {
                                PROJECTION_OPTIONS.map(p => {
                                    return (
                                        <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                        <FormGroup sx={{ mt: 1 }}>
                            <FormControlLabel control={
                                <Switch
                                    defaultChecked
                                    onChange={handleShowLabels}
                                />
                            } label="SHOW LABELS" />
                        </FormGroup>
                        {projection == "globe" &&
                            <Button
                                variant="contained"
                                sx={{
                                    mt: 1,
                                    color: 'primary.dark',
                                    "&:hover": {
                                        color: 'primary.main',
                                    },
                                }}
                                onClick={toggleSpinGlobe}
                            >
                                {!spinGlobe ? "SPIN GLOBE" : "STOP GLOBE"}
                            </Button>
                        }
                    </FormControl>
                </AccordionDetails>
            </Accordion>
        </Box >
    );
}

export default MapPane;