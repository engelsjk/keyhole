import { NextPage } from "next";
import { useState, ChangeEvent } from "react";
import { Box, Typography, Button, Switch } from '@mui/material';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { InputLabel, FormControl, FormGroup, FormControlLabel, MenuItem } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import Select from '~/components/styled/Select';
import { useAppContext } from "~/context/appContext";
import { PROJECTION_OPTIONS } from '~/components/constants';

interface Props { }

const MapPane: NextPage<Props> = (props) => {

    const {
        projection,
        setProjection,
    } = useAppContext();

    const [expanded, setExpanded] = useState<boolean>(false);

    const handleExpanded = (event: React.SyntheticEvent, newExpanded: boolean) => {
        setExpanded(newExpanded);
    };

    const handleChangeProjection = (event: SelectChangeEvent<unknown>) => {
        const proj = event.target.value as string;
        setProjection(proj);
    }

    return (
        <Box
            sx={{
                mt: 1,
                mb: 1,
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
                            MenuProps={{
                                sx: {
                                    "& .MuiMenu-paper": {
                                        color: 'primary.light',
                                        bgcolor: 'primary.dark',
                                    }
                                }
                            }}
                        >
                            {
                                PROJECTION_OPTIONS.map(p => {
                                    return (
                                        <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                </AccordionDetails>
            </Accordion>
        </Box >
    );
}

export default MapPane;