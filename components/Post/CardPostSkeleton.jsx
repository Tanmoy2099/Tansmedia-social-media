import { CardContent, Container, ListItem, ListItemAvatar, ListItemText, Paper, Skeleton } from '@mui/material';
import React from 'react'

const CardPostSkeleton = () => {
  return (
    <>
      <Paper>
        <Skeleton variant="rectangular" height='15rem' width='100%' />
        <CardContent sx={{ display: 'flex', flexDirection: 'column' }} >
          <ListItem alignItems="flex-start" sx={{ cursor: 'pointer', width: 'fit-content' }}>
            <ListItemAvatar>
              <Skeleton variant="circular" width='3rem' height='3rem' />
            </ListItemAvatar>
            <ListItemText
              sx={{ width: 'fit-content', maxWidth: '10rem' }}
              primary={<>
                <Skeleton variant="text" sx={{ width: '6rem', mx: 1, fontSize: '1rem' }} />
                <Skeleton variant="text" sx={{ width: '6rem', mx: 1, fontSize: '1rem' }} />
              </>
              }
              secondary={
                <>
                  <Skeleton variant="text" sx={{ width: '100%', mx: 1, fontSize: '1.2rem' }} />
                </>}
            />
            <Skeleton variant="text" sx={{ width: '100%', mx: 1, fontSize: '1rem' }} />

            {/* </> */}
            {/* }
              /> */}

          </ListItem>

        </CardContent>
      </Paper>
    </>
  )
}

export default CardPostSkeleton;