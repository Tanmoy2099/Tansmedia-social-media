
import _ from 'lodash';

import { Alert, AlertTitle, Backdrop, Box, Button, Container, IconButton, Paper, Snackbar, TextField } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

import { useState, useRef } from 'react';
import uploadPic from '../../utils/uploadPicToCloudinary';
import Loader from '../Layout/CustomLoader/Loader';
import ImageDropBox from '../UI/ImageDropBox';

import { profileUpdate } from '../../utils/userActions';

import CropImageModel from '../Post/CropImageModel';

//Need to complete it
const UpdateProfile = ({ profile }) => {


  const [about, setAbout] = useState(profile.about);

  const [highlighted, setHighlighted] = useState(false);

  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const initialMsg = { hasMsg: false, type: 'info', message: '' }
  const [msg, setMsg] = useState(initialMsg);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    let profilePicUrl;
    if (media !== null) { profilePicUrl = await uploadPic(media) }


    if (media !== null && !profilePicUrl) {
      setLoading(false);
      return setMsg({ hasMsg: true, type: 'error', message: 'Cannot upload Image' })
    }
    const data = { about, profilePicUrl }
    await profileUpdate(data, setLoading, setMsg);

  };


  const handlePhotoChange = e => {
    const { files } = e.target;
    if (files && files.length > 0) {
      setMedia(files[0]);
      setMediaPreview(URL.createObjectURL(files[0]))
    }
  }




  const removeAlertMsg = () => setMsg(initialMsg);

  const InputFsStyle = { style: { fontSize: 18 } };

  return (
    <>
      <Backdrop open={showModal} sx={{ zIndex: 10 }}>
        <Container sx={{ maxWidth: { xs: '100%', sm: '95%', md: '45rem', lg: '60%' }, position: 'relative' }}>
          <Paper>
            <CropImageModel
              mediaPreview={mediaPreview}
              setMedia={setMedia}
              setShowModal={setShowModal}
              setMediaPreview={setMediaPreview}
            />
          </Paper>

          <IconButton color='primary'
            sx={{
              left: { xs: '42%', sm: '48%' },
              position: 'absolute',
              bottom: -20
            }}
            onClick={() => setShowModal(false)}
            variant='contained'>
            <CancelIcon sx={{
              height: { xs: '2.5rem', xl: '3rem' },
              width: { xs: '2.5rem', xl: '3rem' },
              color: '#1e88e5',
              '&:hover': {
                color: '#1e9ee5',
                bgcolor: '#eee',
                borderRadius: '50%'
              }
            }} />
          </IconButton>


        </Container>
      </Backdrop>


      <Paper sx={{ maxWidth: 'lg', p: 1 }}>
        <Snackbar open={msg.hasMsg} autoHideDuration={15000} onClose={removeAlertMsg}>
          <Alert
            sx={{ width: '100%', fontSize: '1.2rem' }}
            onClose={removeAlertMsg}
            severity={msg.type || 'error'}
          >
            <AlertTitle>{_.capitalize(msg.type)}</AlertTitle>
            {msg.message}
          </Alert>
        </Snackbar>

        <Box component='form' onSubmit={handleSubmit} sx={{ mx: 'auto', width: { xs: '100%', sm: '75%', md: '60%' } }}>




          {/* Image dropbox */}
          <ImageDropBox
            inputRef={inputRef}
            highlighted={highlighted}
            setHighlighted={setHighlighted}
            handleChange={handlePhotoChange}
            media={media}
            setMedia={setMedia}
            mediaPreview={mediaPreview}
            profilePicUrl={profile.profilePicUrl}
          />



          {media && <Button variant='contained'
            onClick={() => setShowModal(true)}
            sx={{ textTransform: 'none', m: 'auto' }} size='small'>
            Crop Image
          </Button>}



          {/* About */}
          <TextField
            margin="normal"
            required
            variant="outlined"
            // variant="filled"
            color='success'
            fullWidth
            name="about"
            label="About"
            type="text"
            id="about"
            multiline
            maxRows={4}
            autoComplete="off"
            InputProps={InputFsStyle}
            InputLabelProps={InputFsStyle}
            labelwidth={20}
            value={about}
            onChange={e => setAbout(e.target.value)}
          />

          <Button
            disabled={loading}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, fontSize: '1.1rem', textTransform: 'none' }} >
            {loading ? <Loader size="1.5rem" color='success' /> : 'Submit'}
          </Button>

        </Box>
      </Paper>
    </>
  )
}

export default UpdateProfile;