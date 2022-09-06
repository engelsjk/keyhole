import { NextPage } from "next";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

interface Props { }

const FramePane: NextPage<Props> = (props) => {
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
            <Chip label="FRAME ID" />
            <Chip label="CAMERA TYPE" />
            <Chip label="SEQUENCE/FRAME" />
            <Chip label="ACQUISITION DATE" />
            <Chip label="DOWNLOAD AVAILABLE" />
        </Box>
    );
}

export default FramePane;