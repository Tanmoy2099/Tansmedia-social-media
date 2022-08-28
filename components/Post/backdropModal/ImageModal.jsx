
import { Box, CardMedia, Typography } from '@mui/material';

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
        /> : <>
          <Typography variant="body1"
            sx={{ textAlign: 'center' }}
            color="initial">No picture available</Typography>
        </>
        }


      </Box>
    </>
  )
}

export default ImageModal;