
import SelectBase from '@mui/material/Select';
import { styled } from '@mui/material/styles';

const Select = styled(SelectBase)(({ theme }) => ({
    "& .MuiInputLabel-root, .MuiInputLabel-filled": {
        color: theme.palette.primary.light,
    },
    "& .Mui-focused": {
        color: theme.palette.primary.main,
    },
    "& .MuiInputBase-input": {
        color: theme.palette.primary.light,
        bgcolor: theme.palette.primary.dark,
    },
    "& .MuiSvgIcon-root": {
        color: theme.palette.primary.light,
    },
    '& .MuiMenu-paper': {
        color: theme.palette.primary.light,
        bgcolor: theme.palette.primary.dark,
    },
    "& .MuiMenuItem-root": {

    },
}));

export default Select;
