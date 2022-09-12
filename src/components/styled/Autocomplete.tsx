
import AutocompleteBase from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';

const Autocomplete = styled(AutocompleteBase)(({ theme }) => ({
    "& .MuiInputLabel-root": {
        color: theme.palette.primary.light,
    },
    "& .Mui-focused": {
        color: theme.palette.primary.main,
    },
    "& .MuiAutocomplete-root": {
        color: theme.palette.primary.main,
    },
    "& .MuiInputBase-input": {
        color: theme.palette.primary.light,
    },
    "& .MuiSvgIcon-root": {
        color: theme.palette.primary.main,
    },

}));

export default Autocomplete;
