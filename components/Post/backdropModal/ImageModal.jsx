
import { Box, CardMedia} from '@mui/material';

const ImageModal = ({ post}) => {



  return (
    <>
      <Box sx={{
        width: '89vw',
        height: 'fit-content', 
        overFlow: 'auto',
        transition: 'all 300ms ease-in-out',

      }}>

          <CardMedia
            component='img'
            alt='img post'
            src={post.picUrl}
            draggable='false'
            sx={{ my: 'auto', width: '100%', height:'100%', maxHeight: '89vh' }}
          />
        </Box>
    </>
  )
}

export default ImageModal;