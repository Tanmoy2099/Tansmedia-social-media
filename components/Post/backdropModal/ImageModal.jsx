
import { Box, CardMedia, Paper, Typography } from '@mui/material';

const ImageModal = ({ post }) => {



  return (
    <>
      <Box sx={{
        width: '89vw',
        height: 'fit-content',
        overFlow: 'auto',
        transition: 'all 300ms ease-in-out',

      }}>

        {post.picUrl ? <CardMedia
          component='img'
          alt='img post'
          src={post.picUrl}
          draggable='false'
          sx={{ my: 'auto', width: '100%', height: '100%', maxHeight: '89vh' }}
        /> : <Paper sx={{height:'3rem'}}>
          <Typography variant="body1"
            sx={{ textAlign: 'center', color:'black' }}
            color="initial">No picture is attached</Typography>
        </Paper>
        }


      </Box>
    </>
  )
}

export default ImageModal;