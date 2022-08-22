import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';

import { Alert, AlertTitle, Snackbar } from '@mui/material';
import _ from 'lodash';

import { useSelector, useDispatch } from 'react-redux';

import { Grid, Box, Avatar, Button, CssBaseline, TextField, Typography, Container, InputAdornment, CircularProgress } from '@mui/material';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';


import ImageDropBox from '../components/UI/ImageDropBox';
import uploadPic from '../utils/uploadPicToCloudinary';

import axios from 'axios';
import baseUrl from '../utils/baseUrl';
import { registerUser } from '../utils/authUser';
import SnackBarMsg from '../components/UI/SnackBarMsg';

import { userActions } from '../Store/user-slice';
import { signupActions } from '../Store/Signup-slice';


let cancel;


const Signup = () => {

  const dispatch = useDispatch();

  const { Name, UserName, Email, Password, ConfirmPassword, About } = useSelector(state => state.signup);
  const [isTouched, setIsTouched] = useState({ name: false, userName: false, email: false, password: false, confirmPassword: false, about: false });
  const [isVisible, setIsVisible] = useState({ password: false, confirmPassword: false });

  const [media, setMedia] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const initialMsg = { hasMsg: false, type: '', message: '' };
  const [msg, setMsg] = useState(initialMsg);

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
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormLoading(true);

    let profilePicUrl;
    if (media !== null) {
      profilePicUrl = await uploadPic(media);
      console.log(profilePicUrl);
    }


    if (media !== null && !profilePicUrl) {
      setFormLoading(false);
      return setMsg({ hasMsg: true, type: 'error', message: 'Cannot upload Image' })
    }
    const user = { name: Name.value, username: UserName.value, email: Email.value, password: Password.value, confirmPassword: ConfirmPassword.value, about: About.value };

    await registerUser(user, profilePicUrl, setMsg, setFormLoading, dispatch);

  };

  const removeAlertMsg = () => setMsg(initialMsg);

  const InputFsStyle = { style: { fontSize: 18 } };
  const helpingText = text => <Typography component="span" variant="body1">{text}</Typography>



  return (
    <Container component="main" maxWidth="md" sx={{ mb: 2 }}>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >

        {/*A message section to show message or error */}
        <SnackBarMsg msg={msg} setMsg={setMsg} />


        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h4">
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
          />


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
            autoFocus
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
            sx={{ mt: 3, mb: 2, fontSize: '1.1rem' }} >
            {/* {formLoading ? <CircularProgress size="1.5rem" color='success' /> : 'Signup'} */}
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/login" variant="body1" >
                {"Already have an account? LogIn"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default Signup;
