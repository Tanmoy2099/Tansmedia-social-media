
import _ from 'lodash';

import { Alert, AlertTitle, Box, Button, Container, Paper, Snackbar, TextField } from '@mui/material';
import { useState, useRef } from 'react';
import uploadPic from '../../utils/uploadPicToCloudinary';
import Loader from '../Layout/CustomLoader/Loader';
import ImageDropDiv from '../UI/ImageDropBox';

import { profileUpdate } from '../../utils/userActions';

//Need to complete it
const UpdateProfile = ({ profile }) => {


  const [about, setAbout] = useState(profile.about);

  const [highlighted, setHighlighted] = useState(false);
  const [media, setMedia] = useState(null);

  const initialMsg = { hasMsg: '', type: 'info', message: '' }
  const [msg, setMsg] = useState(initialMsg);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    let profilePicUrl;
    if (media !== null) {profilePicUrl = await uploadPic(media)}


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
    }
  }




  const removeAlertMsg = () => setMsg(initialMsg);

  const InputFsStyle = { style: { fontSize: 18 } };

  return (
    <Paper sx={{ maxWidth: 'lg', p:1 }}>
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

      <Box component='form' onSubmit={handleSubmit} sx={{mx:'auto', width:{xs:'100%', sm:'75%', md:'60%'}}}>




        {/* Image dropbox */}
        <ImageDropDiv
          inputRef={inputRef}
          highlighted={highlighted}
          setHighlighted={setHighlighted}
          handleChange={handlePhotoChange}
          media={media}
          setMedia={setMedia}
          profilePicUrl={profile.profilePicUrl}
        />

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
  )
}

export default UpdateProfile;