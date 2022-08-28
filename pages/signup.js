import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

import _ from 'lodash';

import { useSelector, useDispatch } from 'react-redux';

import { Grid, Box, Avatar, Button, TextField, Typography, Container, InputAdornment, CircularProgress, Paper, Backdrop, IconButton } from '@mui/material';

import CancelIcon from '@mui/icons-material/Cancel';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';


import ImageDropBox from '../components/UI/ImageDropBox';
import uploadPic from '../utils/uploadPicToCloudinary';
import CropImageModel from '../components/Post/CropImageModel';

import baseUrl from '../utils/baseUrl';
import { registerUser } from '../utils/authUser';
import SnackBarMsg from '../components/UI/SnackBarMsg';

import { signupActions } from '../Store/Signup-slice';



let cancel;


const Signup = () => {

  const dispatch = useDispatch();

  const { Name, UserName, Email, Password, ConfirmPassword, About } = useSelector(state => state.signup);
  const [isTouched, setIsTouched] = useState({ name: false, userName: false, email: false, password: false, confirmPassword: false, about: false });
  const [isVisible, setIsVisible] = useState({ password: false, confirmPassword: false });

  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const initialMsg = { hasMsg: false, type: 'info', message: '' };
  const [msg, setMsg] = useState(initialMsg);

  const [showModal, setShowModal] = useState(false);
  const [userNameAvailable, setUserNameAvailable] = useState(false);
  const [userNameLoading, setUserNameLoading] = useState(false);
  const [highlighted, setHighlighted] = useState(false);
  const inputRef = useRef();


  const checkUsername = async () => {

    setUserNameLoading(true)

    if (!UserName.isValid) {
      setUserNameLoading(false);
      return
    }
    try {
      cancel && cancel();

      const CancelToken = axios.CancelToken;


      const res = await axios.get(`${baseUrl}/user/${UserName?.value}`, {
        cancelToken: new CancelToken(canceler => {
          cancel = canceler;
        })
      });


      if (msg.hasMsg) setMsg(initialMsg);

      if (res.data.status === 'ok') {
        setUserNameAvailable(true);
      } else {
        throw new Error(res.data.message);
      }
    } catch (error) {

      setMsg({ hasMsg: true, type: 'warning', message: (error.response?.data?.message || error.message) });
      setUserNameAvailable(false);
    } finally {
      setUserNameLoading(false)
    }
  }

  useEffect(() => {

    UserName?.value === '' ? setUserNameAvailable(false) : checkUsername();

  }, [UserName?.value]);




  const handlePhotoChange = e => {
    const { files } = e.target;
    if (files && files.length > 0) {
      setMedia(files[0]);
      setMediaPreview(URL.createObjectURL(files[0]));
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormLoading(true);

    let profilePicUrl;
    if (media !== null) {
      profilePicUrl = await uploadPic(media);
    }

    if (media !== null && !profilePicUrl) {
      setFormLoading(false);
      return setMsg({ hasMsg: true, type: 'error', message: 'Cannot upload Image' })
    }
    const user = { name: Name.value, username: UserName.value, email: Email.value, password: Password.value, confirmPassword: ConfirmPassword.value, about: About.value };

    try {
      await registerUser(user, profilePicUrl, dispatch);
    } catch (error) {
      setMsg({ hasMsg: true, type: 'error', message: (error.response?.data?.message || error.message) })
    }
    setFormLoading(false);
  };




  const cropImageBackdrop = <Backdrop open={showModal} sx={{ zIndex: 10 }}>
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















  const removeAlertMsg = () => setMsg(initialMsg);

  const InputFsStyle = { style: { fontSize: 18 } };
  const helpingText = text => <Typography component="span" variant="body1">{text}</Typography>



  return (
    <Container component="main" maxWidth="md" sx={{ mb: 2, px:1 }}>

      {cropImageBackdrop}

      <Paper
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 1
        }}
      >

        {/*A message section to show message or error */}
        <SnackBarMsg msg={msg} setMsg={setMsg} />


        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h4" sx={{fontSize:{xs:'1.3rem', sm:'1.5rem', md:'2rem'}}}>
          Create an Account
        </Typography>
        <Box component="form" sx={{ mt: 1 }}
          onSubmit={handleSubmit} >


          {/* Image dropbox */}
          <ImageDropBox
            inputRef={inputRef}
            highlighted={highlighted}
            setHighlighted={setHighlighted}
            handleChange={handlePhotoChange}
            media={media}
            setMedia={setMedia}
            mediaPreview={mediaPreview}
          />

          {media && <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
            <Button variant='contained'
              onClick={() => setShowModal(true)}
              sx={{ textTransform: 'none', m: 'auto' }} size='small'>
              Crop Image
            </Button>
          </Box>}


          {/* UserName */}
          <TextField
            margin="normal"
            variant="outlined"
            // variant="filled"
            // color='success'
            required
            fullWidth
            autoComplete='username'
            type='text'
            autoFocus
            id="userName"
            label="Username"
            name="username"
            InputProps={{
              ...InputFsStyle,
              endAdornment: <InputAdornment position='end'>
                {userNameLoading ? <CircularProgress size="1.5rem" /> : (userNameAvailable ? <DoneIcon color='success' /> : <CloseIcon color='error' />)}
              </InputAdornment>
            }}
            InputLabelProps={InputFsStyle}
            labelwidth={20}
            value={UserName.value}
            error={!userNameAvailable && isTouched.userName}
            helperText={!userNameAvailable && isTouched.userName ? helpingText('Username is not valid') : ''}
            onBlur={() => setIsTouched(touched => ({ ...touched, userName: true }))}
            onChange={e => dispatch(signupActions.userName(e.target.value))}
          />


          {/* Full Name */}
          <TextField
            type='text'
            margin="normal"
            variant="outlined"
            // color='success'
            required
            fullWidth
            id="name"
            label="Full Name"
            name="name"
            autoComplete="name"
            InputProps={InputFsStyle}
            InputLabelProps={InputFsStyle}
            labelwidth={30}
            value={Name.value}
            error={!Name.isValid && isTouched.name}
            helperText={!Name.isValid && isTouched.name ? helpingText('Please enter a valid name') : ''}
            onBlur={() => setIsTouched(touched => ({ ...touched, name: true }))}
            onChange={e => dispatch(signupActions.name(e.target.value))}
          />


          {/* Email */}
          <TextField
            margin="normal"
            variant="outlined"
            // variant="filled"
            required
            fullWidth
            id="email"
            type="email"
            // color='success'
            label="Email Address"
            name="email"
            autoComplete="email"
            InputProps={InputFsStyle}
            InputLabelProps={InputFsStyle}
            labelwidth={20}
            value={Email.value}
            error={!Email.isValid && isTouched.email}
            helperText={!Email.isValid && isTouched.email ? helpingText('Please enter a valid Email Address') : ''}
            onBlur={() => setIsTouched(touched => ({ ...touched, email: true }))}
            onChange={e => dispatch(signupActions.email(e.target.value))}
          />

          {/* Password */}
          <TextField
            margin="normal"
            variant="outlined"
            // variant="filled"
            // color='success'
            required
            fullWidth
            name="password"
            label="Password"
            type={isVisible.password ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            InputProps={{
              ...InputFsStyle,
              endAdornment: <InputAdornment position='end'
                sx={{ cursor: 'pointer' }}
                onClick={() => setIsVisible(visible => ({ ...visible, password: !visible.password }))}>
                {isVisible.password ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
              </InputAdornment>
            }}
            InputLabelProps={InputFsStyle}
            labelwidth={20}
            value={Password.value}
            error={!Password.isValid && isTouched.password}
            helperText={!Password.isValid && isTouched.password ? helpingText('Password Should have more than 7 characters') : ''}
            onBlur={() => setIsTouched(touched => ({ ...touched, password: true }))}
            onChange={e => dispatch(signupActions.password(e.target.value))}
          />

          {/* Confirm password */}
          <TextField
            margin="normal"
            variant="outlined"
            // variant="filled"
            // color='success'
            required
            fullWidth
            name="confirm-password"
            label="Confirm Password"
            type={isVisible.confirmPassword ? "text" : "password"}
            id="confirm-password"
            autoComplete="current-password"
            InputProps={{
              ...InputFsStyle,
              endAdornment: <InputAdornment position='end'
                sx={{ cursor: 'pointer' }}
                onClick={() => setIsVisible(visible => ({ ...visible, confirmPassword: !visible.confirmPassword }))}>
                {isVisible.confirmPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
              </InputAdornment>
            }}
            InputLabelProps={InputFsStyle}
            labelwidth={20}
            value={ConfirmPassword.value}
            error={!ConfirmPassword.isValid && isTouched.confirmPassword}
            helperText={!ConfirmPassword.isValid && isTouched.confirmPassword ? helpingText('Not matching with the password') : ''}
            onBlur={() => setIsTouched(touched => ({ ...touched, confirmPassword: true }))}
            onChange={e => dispatch(signupActions.confirmPassword(e.target.value))}
          />

          {/* About */}
          <TextField
            margin="normal"
            required
            variant="outlined"
            // variant="filled"
            // color='success'
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
            value={About.value}
            onChange={e => dispatch(signupActions.about(e.target.value))}
          />


          <Button
            disabled={!(Name.isValid && Email.isValid && Password.isValid && ConfirmPassword.isValid && userNameAvailable) || formLoading}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, fontSize: '1.1rem', textTransform: 'none' }} >
            {formLoading ? <CircularProgress fontSize="60%" color='success' /> : 'Signup'}
          </Button>


          <Grid container>
            <Grid item>
              <Link href="/login" variant="body1" >
                <Typography variant='body2' component='h5' sx={{ cursor: 'pointer' }}>
                  Already have an account? LogIn
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default Signup;
