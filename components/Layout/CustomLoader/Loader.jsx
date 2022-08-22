import { CircularProgress, Container } from '@mui/material';
import React from 'react'

const Loader = (props) => {
  return (
    <>
      <Container fullwidth='lg' sx={{ display: 'flex', justifyContent: 'enter' }}>
        <CircularProgress sx={{ mx: 'auto' }} {...props} />
      </Container>
    </>
  )
}

export default Loader;