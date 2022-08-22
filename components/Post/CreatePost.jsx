import { useState, useRef } from "react";

import { Alert, AlertTitle, Avatar, Box, Button, CircularProgress, Divider, Grid, InputAdornment, Paper, TextField, IconButton, Typography } from "@mui/material";

import uploadPic from "../../utils/uploadPicToCloudinary";
import { submitNewPost } from "../../utils/postActions";
// import CropImageModal from "./CropImageModal";

import AddCircleIcon from '@mui/icons-material/AddCircle';
import SendIcon from '@mui/icons-material/Send';
import PlaceIcon from '@mui/icons-material/Place';
import CancelIcon from '@mui/icons-material/Cancel';


const CreatePost = ({ user, setPosts, setShowCreatePost }) => {


  const [newPost, setNewPost] = useState({ text: "", location: "" });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const [error, setError] = useState(null);
  const [highlighted, setHighlighted] = useState(false);

  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  // const [showModal, setShowModal] = useState(false);

  const handleChange = e => {

    const { name, value, files } = e.target;

    if (name === "media") {
      if (files && files.length > 0) {
        setMedia(files[0]);
        setMediaPreview(URL.createObjectURL(files[0]));
        return
      }
    }

    setNewPost(prev => ({ ...prev, [name]: value }));
  };

  const addImageInputStyles = () => ({
    textAlign: 'center',
    height: '12rem',
    width: '12rem',
    border: 'dotted',
    paddingTop: `${media === null && '3.75rem'}`,
    cursor: 'pointer',
    borderColor: `${highlighted ? 'green' : 'black'}`,

  });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    let picUrl;

    if (media !== null) {
      picUrl = await uploadPic(media);
      if (!picUrl) {
        setLoading(false);
        return setError("Error Uploading Image");
      }
    }

    await submitNewPost(
      user,
      newPost.text,
      newPost.location,
      picUrl,
      setPosts,
      setNewPost,
      setError
    );

    setMedia(null);
    mediaPreview && URL.revokeObjectURL(mediaPreview);
    setTimeout(() => setMediaPreview(null), 3000);
    setLoading(false);
  };


  const dragEvent = (e, valueToSet) => {
    e.preventDefault();
    setHighlighted(valueToSet);
  };


  const InputFsStyle = { style: { fontSize: 14 } };











  return <Paper sx={{
    position: 'relative', my: 2,
    minHeight: '5rem'
  }}>
    {error !== null && <>
      <Alert severity="error"
        onClose={() => setError(null)}>
        <AlertTitle >Oops!</AlertTitle>
        {error}
      </Alert>
    </>}

    <Typography variant='h6' textAlign='center' sx={{pt:0.5}}>Create post</Typography>
    <Box component="form"
      sx={{
        m: 2,
        transition: 'all 1s ease-in-out',
        // display: showCreatePost ? 'block' : 'none',
      }}
      onSubmit={handleSubmit} >


      <Box>
        <Box sx={{ display: 'flex' }}>
          <Avatar src={user.profilePicUrl}
            sx={{ marginTop: '1rem' }}
            alt="profile pic" size='large' />

        </Box>
        {/* location */}
        <TextField
          margin="normal"
          variant="outlined"
          color='success'
          name="location"
          label="Location"
          type="text"
          id="location"
          size='small'
          sx={{mx:'auto'}}
          autoComplete="off"
          InputProps={{
            endAdornment: <InputAdornment position='end'>
              <PlaceIcon />
            </InputAdornment>
          }}
          labelwidth={20}
          value={newPost.location}
          onChange={handleChange}

        />

      </Box>

      <input type="file"
        ref={inputRef}
        name='media'
        style={{
          display: 'none',
          height: '100%',
          width: '100%'
        }}
        accept='image/*'
        onChange={handleChange}
      />
      <Box
        sx={addImageInputStyles()}
        onClick={() => inputRef.current.click()}
        onDragOver={e => dragEvent(e, true)}
        onDragLeave={e => dragEvent(e, false)}
        onDrop={e => {
          dragEvent(e, true);

          const droppedFile = Array.from(e.dataTransfer.files);

          if (droppedFile?.length > 0) {
            setMedia(droppedFile[0]);
            setMediaPreview(URL.createObjectURL(droppedFile[0]));
          }
        }}
      >

        {(media === null) ? <>
          <AddCircleIcon size='large' sx={{ fontSize: '4rem' }} />
        </> : <>
          <img src={mediaPreview}
            alt='post Img'
            size='small'
            name='media'
            style={{
              height: '12rem',
              width: '12rem'
            }} />
        </>}

      </Box>


      {/* post */}
      <TextField
        margin="normal"
        variant="outlined"
        fullWidth
        sx={{ mx: 'auto' }}
        color='success'
        name="text"
        label="Create Post"
        type="text"
        id="post"
        multiline
        maxRows={3}
        autoComplete="off"
        InputProps={InputFsStyle}
        InputLabelProps={InputFsStyle}
        labelwidth={20}
        value={newPost.text}
        onChange={handleChange}
      />

      <Divider display='hidden' />

      <Box sx={{ display: 'flex' }}>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          type='submit'
          disabled={!newPost.text || loading}
          sx={{ my: 1 }}>
          {loading ? <CircularProgress size='2rem' sx={{ color: '#fff' }} /> : <SendIcon sx={{ color: '#fff' }} />}
        </Button>
      </Box>

    </Box>

    <IconButton color='primary'
      sx={{
        left: {xs:'42%' , sm:'48%'},
        position: 'absolute',
        bottom: -20
      }}
      onClick={() => setShowCreatePost(false)}
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

    <Divider />
  </Paper>
}

export default CreatePost;