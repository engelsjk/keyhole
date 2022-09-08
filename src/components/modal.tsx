import { NextPage } from "next";

import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MuiModal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import HelpIcon from '@mui/icons-material/Help';

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '75%',
    bgcolor: 'background.paper',
    borderColor: 'primary.main',
    borderStyle: 'solid',
    borderWidth: 4,
    boxShadow: 24,
    p: 4,
};

interface Props {
    open: boolean;
    handleClose: () => void;
};

const Modal: NextPage<Props> = (props) => {
    return (
        <div>
            <MuiModal
                open={props.open}
                onClose={props.handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography id="modal-modal-title" variant="h6" component="h1">
                        KEYHOLE SWATHS
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        An experimental visualization of ground swath coverage from declassified spy satellite imagery.
                    </Typography>
                </Box>
            </MuiModal>
        </div >
    );
}

export default Modal;