import { NextPage } from "next";

import { useState } from 'react';
import { Box, Typography, Stack, Switch, FormGroup, FormControlLabel } from '@mui/material';
import MuiModal from '@mui/material/Modal';
import CircleTwoToneIcon from '@mui/icons-material/CircleTwoTone';
import { useTheme } from '@mui/material/styles';

import { RESOLUTION_LABELS } from '~/components/constants';

interface Props {
    open: boolean;
    handleClose: () => void;
};

const Modal: NextPage<Props> = (props) => {

    const theme = useTheme();

    const [units, setUnits] = useState<boolean>(true);

    const handleUnits = () => {
        setUnits(v => !v)
    };

    return (
        <div>
            <MuiModal
                open={props.open}
                onClose={props.handleClose}
                sx={{
                    color: 'primary.light',
                    "& .MuiBackdrop-root": {
                        bgcolor: 'rgba(0,0,0,0.75)',
                    },
                }}
            >
                <Box
                    sx={{
                        position: 'absolute' as 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '85%',
                        bgcolor: 'primary.dark',
                        borderColor: 'primary.light',
                        borderStyle: 'solid',
                        borderWidth: 1,
                        // borderRadius: 3,
                        boxShadow: 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px',
                        p: 4,
                        maxHeight: '90%',
                        overflowY: 'scroll'
                    }}
                >
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 'bold',
                            color: 'primary.main',
                        }}
                    >
                        KEYHOLE //SWATHS//
                    </Typography>
                    <Typography
                        sx={{
                            mt: 2,
                            fontSize: '1rem',
                            lineHeight: 1.5,
                            fontStyle: 'italic',
                            fontWeight: 'bold',
                        }}>
                        An experimental visualization of ground swaths from declassified spy satellite imagery.
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 3 }} >Imagery</Typography>
                    <Typography paragraph sx={{ mt: 1, fontSize: '1rem', lineHeight: 1.5 }}>
                        The ground swaths shown here are derived from metadata for over 1.3 million images taken by
                        U.S. spy satellites between 1960 to 1984. Imagery from the KH-1 CORONA through KH-9 HEXAGON
                        satellite programs was declassified starting in 1995, with the exception of any KH-8 GAMBIT-3 imagery which remains
                        classified.
                    </Typography>
                    <Typography
                        component="div"
                        sx={{
                            "& a:link,a:visited": {
                                color: 'inherit',
                                textDecoration: 'none',
                                borderBottom: `1px solid ${theme.palette.primary.main}`,
                            }
                        }}>
                        <blockquote> <a
                            href="https://www.govinfo.gov/content/pkg/WCPD-1995-02-27/pdf/WCPD-1995-02-27-Pg304.pdf"><strong>Executive
                                Order 12951</strong></a> (<i>February 22, 1995</i>): &quot;Imagery acquired by the space-based
                            national intelligence reconnaissance systems known as the Corona, Argon and Lanyard missions shall,
                            within 18 months of the date of this order, be declassified and transferred to the National Archives and
                            Records Administration with a copy sent to the United States Geological Survey of the Department of the
                            Interior consistent with procedures approved by the Director of Central Intelligence and the Archivist
                            of the United States. Upon transfer, such imagery shall be deemed declassified and shall be made
                            available to the public.&quot;</blockquote>
                    </Typography>
                    <Typography paragraph sx={{ fontSize: '1rem', lineHeight: 1.5 }}>
                        Imagery and its metadata are hosted by the USGS at the following datasets:
                    </Typography>
                    <Typography
                        component="div"
                        sx={{
                            "& a:link,a:visited": {
                                color: 'inherit',
                                textDecoration: 'none',
                                borderBottom: `1px solid ${theme.palette.primary.main}`,
                            }
                        }}>
                        <ul>
                            <li><a
                                href="https://www.usgs.gov/centers/eros/science/usgs-eros-archive-declassified-data-declassified-satellite-imagery-1">Declassified
                                Data / Declass 1 (1996)</a></li>
                            <li><a
                                href="https://www.usgs.gov/centers/eros/science/usgs-eros-archive-declassified-data-declassified-satellite-imagery-2">Declassified
                                Data / Declass 2 (2002)</a></li>
                            <li><a
                                href="https://www.usgs.gov/centers/eros/science/usgs-eros-archive-declassified-data-declassified-satellite-imagery-3">Declassified
                                Data / Declass 3 (2011)</a></li>
                        </ul>
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 3 }} >Ground Swaths</Typography>
                    <Typography paragraph sx={{ mt: 1, fontSize: '1rem', lineHeight: 1.5 }}>
                        Swath geometries are generated from the specified corner coordinates of an image and should be considered a rough estimate of actual imagery coverage. Swaths are styled according to estimates of the {"imagery's"} ground resolution.
                    </Typography>
                    <div>
                        <Stack direction="column">
                            {
                                RESOLUTION_LABELS.map((l, i) => {
                                    return (<Stack
                                        direction="row"
                                        sx={{
                                            mb: 1,
                                            ml: 2
                                        }}
                                        spacing={2}
                                        key={`s_${i}`}
                                    >
                                        <CircleTwoToneIcon
                                            sx={{
                                                alignItems: 'center',
                                                color: l.color,
                                                _outline: 'primary.main'
                                            }}
                                        ></CircleTwoToneIcon>
                                        <Typography sx={{
                                            fontSize: '1rem',
                                            minWidth: 75,
                                            // display: 'flex',
                                            alignItems: 'center',
                                            ml: 0,
                                        }} key={`t1_${i}`}>
                                            {units ? l.label_metric : l.label_imperial}
                                        </Typography>
                                        <Typography sx={{
                                            fontSize: '1rem',
                                            alignItems: 'center',
                                            overflowX: 'auto',
                                        }} key={`t2_${i}`}>
                                            {l.systems}
                                        </Typography>
                                    </Stack>)
                                })
                            }
                        </Stack>
                        <FormGroup sx={{ ml: 2, mt: 1, mb: 2, width: 100 }}>
                            <FormControlLabel
                                control={
                                    <Switch size="small"
                                        defaultChecked
                                        onChange={handleUnits}
                                    />
                                }
                                label={units ? "METERS" : "FEET"} />
                        </FormGroup>
                    </div>
                    <Typography paragraph sx={{ mt: 1, fontSize: '1rem', lineHeight: 1.5 }}>
                        Swath geometries are aggregated by mission and can be filtered either by a mission designator or ground
                        resolution. Individual ground swaths are outlined when a
                        specific mission is selected, and are also highlighted if an image is available to download from the
                        USGS (as of June 2022).
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 3 }} >Browse</Typography>
                    <Typography
                        paragraph
                        sx={{
                            mt: 1,
                            fontSize: '1rem',
                            lineHeight: 1.5,
                            "& a:link,a:visited": {
                                color: 'inherit',
                                textDecoration: 'none',
                                borderBottom: `1px solid ${theme.palette.primary.main}`,
                            }
                        }}>
                        To browse, order or download actual imagery from these declassified datasets, check out the
                        USGS EarthExplorer tool <a href="https://earthexplorer.usgs.gov/">here</a>.
                    </Typography>
                    <Typography paragraph sx={{ fontSize: '1rem', lineHeight: 1.5, fontStyle: 'italic' }}>
                        Hint: You can also click on an image swath and then open the USGS EarthExplorer metadata page
                        for that image.
                    </Typography>
                </Box>
            </MuiModal>
        </div >
    );
}

export default Modal;