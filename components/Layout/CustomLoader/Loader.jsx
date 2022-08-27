import { CircularProgress, Container } from '@mui/material';
import React from 'react'

const Loader = (props) => {
  return (
    <>
      <Container sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress sx={{ mx: 'auto', ...props }}  />
      </Container>
    </>
  )
}

export default Loader;