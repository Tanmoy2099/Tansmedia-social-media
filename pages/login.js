
import { useState, useEffect } from 'react';
import cookies from 'js-cookie';
import Link from 'next/link';
import _ from 'lodash';

import { Grid, Box, Avatar, Button, TextField, FormControlLabel, Checkbox, Typography, Container, InputAdornment, CircularProgress, Alert, AlertTitle, Snackbar, Paper } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import { loginUser } from '../utils/authUser';
import SnackBarMsg from '../components/UI/SnackBarMsg';
import appName from '../utilsServer/appName';

const Login = () => {


  const [isTouched, setIsTouched] = useState({ auth: false, password: false, });
  const [isVisible, setIsVisible] = useState(false);

  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');


  const initialMsg = { hasMsg: false, type: 'info', message: '' };
  const [msg, setMsg] = useState(initialMsg);

  const [formLoading, setFormLoading] = useState(false);

  const regexEmailTest = new RegExp(/^[\w.! #$%&'*+/=? ^_`{|}~-]+@[\w].*[\w{2,3}]+$/);



  useEffect(() => {
    document.title = `Welcome to ${appName()}`;
    const userEmail = cookies.get('userEmail');
    if (userEmail) setEmailOrUser(userEmail);
  }, []);


  const handleSubmit = async event => {
    event.preventDefault();
    setFormLoading(true);

    setMsg(initialMsg);

    const value = regexEmailTest.test(emailOrUser) ? { email: emailOrUser, username: '' } : { email: '', username: emailOrUser }

    const user = { ...value, password };
    // await loginUser(user, setMsg);



    try {
      await loginUser(user)
    } catch (error) {
      setMsg({ hasMsg: true, type: 'error', message: (error.response?.data?.message || error.message) })
    }








    setFormLoading(false);

    // setMsg({ hasMsg: true, type: 'error', message: 'hello' })

  };

  // console.log(msg);

  const authLabel = () => emailOrUser.length < 1 ? 'Email or UserName' : (regexEmailTest.test(emailOrUser) ? 'Email' : 'UserName');


  const InputFsStyle = { style: { fontSize: 18 } };
  const helpingText = text => <Typography component="span" variant="body1">{text}</Typography>



  return (
    <Container component="main" maxWidth="xs">

      {/* -------------------- Snackbar ---------------------------- */}
      <SnackBarMsg msg={msg} setMsg={setMsg} />
      {/* ---------------------------------------------------------- */}

      <Paper
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 1
        }}
      >


        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h4">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} Validate sx={{ mt: 1 }}>

          {/* Email */}
          <TextField
            margin="normal"
            variant="outlined"
            required
            fullWidth
            id="email_or_username"
            // color='success'
            label={authLabel()}
            name="email_or_username"
            autoComplete="email"
            autoFocus
            InputProps={InputFsStyle}
            InputLabelProps={InputFsStyle}
            labelwidth={20}
            value={emailOrUser}
            error={!emailOrUser && isTouched.email}
            helperText={!emailOrUser && isTouched.email ? helpingText('Please enter Email or Username') : ''}
            onBlur={() => setIsTouched(touched => ({ ...touched, auth: true }))}
            onChange={e => setEmailOrUser(e.target.value)}
          />

          {/* Password */}
          <TextField
            margin="normal"
            variant="outlined"
            // color='success'
            required
            fullWidth
            name="password"
            label="Password"
            type={isVisible ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            InputProps={{
              ...InputFsStyle,
              endAdornment: <InputAdornment position='end'
                sx={{ cursor: 'pointer' }}
                onClick={() => setIsVisible(visible => !visible)}>
                {isVisible ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
              </InputAdornment>
            }}
            InputLabelProps={InputFsStyle}
            labelwidth={20}
            value={password}
            error={(password.length < 7) && isTouched.password}
            helperText={(password.length < 7) && isTouched.password ? helpingText('Password Should have more than 7 characters') : ''}
            onBlur={() => setIsTouched(touched => ({ ...touched, password: true }))}
            onChange={e => setPassword(e.target.value)}
          />

          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, fontSize: '1.2rem', textTransform: 'none' }}
            disabled={!(emailOrUser && password)}
          >
            {formLoading ? <CircularProgress fontSize='80%' /> : 'Sign In'}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/forgotPassword">
                <Typography sx={{ fontSize: '0.8rem', cursor: 'pointer' }}>
                  Forgot password?
                </Typography>
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup">
                <Typography sx={{ fontSize: '0.8rem', cursor: 'pointer' }}>
                  Don't have an account? Sign Up
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;