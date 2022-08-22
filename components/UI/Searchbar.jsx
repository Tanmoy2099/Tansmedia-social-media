import React from 'react'
import { styled, alpha } from '@mui/material/styles';

import { InputBase, InputAdornment, CircularProgress } from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';




const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),

    paddingLeft: `calc(0.8em + ${theme.spacing(3)})`,
    transition: theme.transitions.create('width')
  },
}));



const Searchbar = (props) => {
  return (
    <Search sx={{ width: 'fit-content', height: 'fit-content' }}>
      
      <SearchIconWrapper>
        {props.loading ? <CircularProgress size="1.2rem" /> : <SearchIcon />}
      </SearchIconWrapper>


      <StyledInputBase
        onBlur={props.onBlur}
        placeholder={props.placeholder}
        inputProps={{ 'aria-label': 'search' }}
        endAdornment={props.value &&
          <InputAdornment
            position='end'
            onClear={props.onClear}
            sx={{ cursor: 'pointer' }}>
            <CloseIcon sx={{
              color: 'white',
              fontSize: '1.2rem',
              transition: '200ms',
              marginRight: {
                xs: '0.2rem',
                sm: '0.3rem'
              },
              '&:hover': {
                color: 'green'
              }
            }} />
          </InputAdornment>}
        value={props.value}
        onChange={props.onChange}
        sx={{
          width: !!props.value ? { xs: '25ch', sm: '30ch' } : { xs: '15ch', sm: '15ch' },
          transition: '0.3s',
          '&:hover': !props.value && {
            width: {
              xs: '25ch',
              sm: '30ch'
            }
          }
        }}
      />
      {props.onDropDown ? props.onDropDown : null}
    </Search>
  )
}


export default Searchbar;