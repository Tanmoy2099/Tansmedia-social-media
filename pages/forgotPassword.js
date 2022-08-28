import { useState, useEffect } from 'react';
import cookies from 'js-cookie';
import Link from 'next/link';
import _ from 'lodash';

import { Grid, Box, Avatar, Button, TextField, Typography, Container, CircularProgress, Paper } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { resetPassword } from '../utils/authUser';
import SnackBarMsg from '../components/UI/SnackBarMsg';
import appName from '../utilsServer/appName';



const ForgotPassword = () => {


  const [isTouched, setIsTouched] = useState(false);
  const [emailOrUser, setEmailOrUser] = useState('');


  const initialMsg = { hasMsg: false, type: '', message: '' };
  const [msg, setMsg] = useState(initialMsg);

  const [sent, setSent] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const regexEmailTest = new RegExp(/^[\w.! #$%&'*+/=? ^_`{|}~-]+@[\w].*[\w{2,3}]+$/);


  useEffect(() => {
    document.title = `Welcome to ${appName()}`;
    const userEmail = cookies.get('userEmail');
    if (userEmail) setEmailOrUser(userEmail);



  }, []);



  const handleSubmit = async event => {

    event.preventDefault();

    const user = regexEmailTest.test(emailOrUser) ? { email: emailOrUser, username: '' } : { email: '', username: emailOrUser }

    const success = await resetPassword(user, setMsg, setFormLoading);
    if (success) setSent(success);
  };



  const authLabel = () => emailOrUser.length < 1 ? 'Email or UserName' : (regexEmailTest.test(emailOrUser) ? 'Email' : 'UserName');


  const InputFsStyle = { style: { fontSize: 18 } };
  const helpingText = text => <Typography component="span" variant="body1">{text}</Typography>



  return <>

    <Container component="main" maxWidth="xs">
      {sent ? <Paper sx={{
        height: '60vh',
        my: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <Typography
          component='h5'
          sx={{ p: 1 }} >

          Token is Sent to your Email !
        </Typography>
        <Typography
          component='h5'
          sx={{ p: 1 }} >
          Click on the link in the Email sent.
        </Typography>
      </Paper> : <>

        {/*A message section to show message or error */}
        <SnackBarMsg msg={msg} setMsg={setMsg} />

        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >

          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} Validate sx={{ mt: 1 }}>

            {/* Email or Password */}
            <TextField
              margin="normal"
              variant="outlined"
              required
              fullWidth
              id="email_or_username"
              label={authLabel()}
              name="email_or_username"
              autoComplete="email"
              autoFocus
              InputProps={InputFsStyle}
              InputLabelProps={InputFsStyle}
              labelwidth={20}
              value={emailOrUser}
              error={!emailOrUser && isTouched}
              helperText={!emailOrUser && isTouched ? helpingText('Please enter Email or Username') : ''}
              onBlur={() => setIsTouched(true)}
              onChange={e => setEmailOrUser(e.target.value)}
            />


            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, fontSize: '1.2rem', textTransform: 'none' }}
              disabled={!emailOrUser || formLoading} >

              {formLoading ? <CircularProgress fontSize='10px' /> : 'Reset'}
            </Button>

            <Grid container>
              <Grid item xs>
                <Link href="/login">
                  <Typography sx={{ fontSize: '0.8rem', cursor: 'pointer' }}>
                    Go back
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
        </Box>
      </>}
    </Container>
  </>
}

export default ForgotPassword;