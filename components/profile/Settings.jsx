
import { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';

import { updatePassword } from '../../utils/authUser';
import { signupActions } from '../../Store/Signup-slice';
import { Box, Button, CircularProgress, InputAdornment, Paper, TextField, Typography, Divider, List, Switch, Container, Alert, AlertTitle } from '@mui/material';

import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SnackBarMsg from '../UI/SnackBarMsg';
import { profileUpdate } from '../../utils/userActions';
import { toggleMessagePopup } from '../../utils/authUser';


const Settings = ({ newMessagePopup }) => {

  const { signup, utility } = useSelector(state => state)
  const { Password, ConfirmPassword } = signup;

  const dispatch = useDispatch();


  const [showEmailOrNameUpdateField, setShowEmailOrNameUpdateField] = useState(false);
  const [showPasswordUpdateField, setShowPasswordUpdateField] = useState(false);
  const [showMessageSettings, setShowMessageSettings] = useState(false);
  const [popupSettings, setPopupSettings] = useState(newMessagePopup);


  const isFirstRun = useRef();

  const [isVisible, setIsVisible] = useState({ currentPassword: false, password: false, confirmPassword: false });

  const [isTouched, setIsTouched] = useState({ email: false, currentPassword: false, password: false, confirmPassword: false });

  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');

  const intialEmailName = { name: '', email: '' };
  const [details, setDetails] = useState(intialEmailName);

  const initialMsg = { hasMsg: false, type: 'info', message: '' };
  const [msg, setMsg] = useState(initialMsg);

  const InputFsStyle = { style: { fontSize: 15 } };
  const helpingText = text => <Typography variant="span" sx={{ fontSize: '0.75rem' }}>{text}</Typography>


  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

  }, [popupSettings]);



  const regexEmailTest = new RegExp(/^[\w.! #$%&'*+/=? ^_`{|}~-]+@[\w].*[\w{2,3}]+$/);
  const buttonStyle = { mt: 3, mb: 2, fontSize: '1rem', textTransform: 'none', width: '49%' }


  // ------------------- Change Email or Name-----------------------------

  const handleEmailOrNameResetSubmit = async e => {
    e.preventDefault();

    if (!details.name && !details.email) return

    let data = {};
    if (details.name) data.name = details.name;
    if (details.email) data.email = details.email;


    await profileUpdate(data, setLoading, setMsg);
    setDetails(intialEmailName);
    setMsg({ hasMsg: true, type: 'info', message: 'success' });
    setTimeout(() => {
      setMsg(initialMsg)
    }, 3000);
  }



  const emailOrNameUpdateForm = <>
    <Box component='form'
      onSubmit={handleEmailOrNameResetSubmit}
      sx={{ maxWidth: 'sm' }}>



      {/* Name */}
      <TextField
        margin="normal"
        variant="outlined"
        // variant="filled"
        fullWidth
        id="name"
        type="text"
        color='success'
        label="Full Name"
        name="name"
        size='small'
        autoComplete="name"
        InputProps={InputFsStyle}
        InputLabelProps={InputFsStyle}
        labelwidth={20}
        value={details.name}
        onChange={e => setDetails(prev => ({ ...prev, name: e.target.value }))}
      />


      {/* Email */}
      <TextField
        margin="normal"
        variant="outlined"
        // variant="filled"
        fullWidth
        id="email"
        type="email"
        color='success'
        label="Email Address"
        name="email"
        size='small'
        autoComplete="email"
        InputProps={InputFsStyle}
        InputLabelProps={InputFsStyle}
        labelwidth={20}
        value={details.email}
        error={!regexEmailTest.test(details.email)}
        helperText={!regexEmailTest.test(details.email) && isTouched.email ? helpingText('Email not valid') : ''}
        onBlur={() => setIsTouched(touched => ({ ...touched, email: true }))}
        onChange={e => setDetails(prev => ({ ...prev, email: e.target.value }))}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          disabled={!(details.name || details.email) || loading}
          type="submit"
          fullWidth
          size='small'
          variant="contained"
          sx={buttonStyle} >
          {loading ? <CircularProgress size="1.5rem" color='success' /> : 'Submit'}
        </Button>
        <Button
          onClickCapture={() => setShowEmailOrNameUpdateField(false)}
          disabled={loading}
          onClick={() => setShowPasswordUpdateField(false)}
          size='small'
          variant="contained"
          sx={buttonStyle}>
          cancel
        </Button>
      </Box>
    </Box>
  </>


  // ----------------------------------------------------------------------



  //  ----------------------  Change Password  --------------------- 
  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    const password = Password.value;
    const confirmPassword = ConfirmPassword.value;

    await updatePassword(currentPassword, password, confirmPassword, setLoading, setMsg);
    dispatch(signupActions.reset());

    setMsg({ hasMsg: true, type: 'info', message: 'Password reset token is sent to your email address' });
    setTimeout(() => {
      setMsg(initialMsg)
    }, 10000);
  };




  const passwordUpdateForm = <>
    <Box component='form'
      onSubmit={handlePasswordResetSubmit}
      sx={{ maxWidth: 'sm' }}>

      {/*Current Password */}
      <TextField
        margin="normal"
        variant="outlined"
        color='success'
        required
        fullWidth
        size='small'
        name="current password"
        label="Current Password"
        type={isVisible.currentPassword ? "text" : "password"}
        id="currentPassword"
        autoComplete="current-password"
        InputProps={{
          ...InputFsStyle,
          endAdornment: <InputAdornment position='end'
            sx={{ cursor: 'pointer' }}
            onClick={() => setIsVisible(visible => ({ ...visible, currentPassword: !visible.currentPassword }))}>
            {isVisible.currentPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
          </InputAdornment>
        }}
        InputLabelProps={InputFsStyle}
        labelwidth={20}
        value={currentPassword}
        error={!currentPassword}
        helperText={!currentPassword ? helpingText('Enter current password') : ''}
        onBlur={() => setIsTouched(touched => ({ ...touched, currentPassword: true }))}
        onChange={e => setCurrentPassword(e.target.value)}
      />

      {/* New Password */}
      <TextField
        margin="normal"
        variant="outlined"
        color='success'
        required
        fullWidth
        size='small'
        name="password"
        label="New Password"
        type={isVisible.password ? "text" : "password"}
        id="password"
        autoComplete="password"
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
        color='success'
        required
        fullWidth
        size='small'
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          disabled={!(Password.isValid && ConfirmPassword.isValid && currentPassword) || loading}
          type="submit"
          size='small'
          variant="contained"
          sx={buttonStyle} >
          {loading ? <CircularProgress size="1.5rem" color='success' /> : 'Submit'}
        </Button>
        <Button
          disabled={loading}
          onClick={() => setShowPasswordUpdateField(false)}
          size='small'
          variant="contained"
          sx={buttonStyle}>
          cancel
        </Button>
      </Box>

    </Box>
  </>
  // ------------------------------------------------------------------
  const headerStyle = { width: '100%', textAlign: 'center', fontSize: { xs: '1.2rem', sm: '1.4rem' }, cursor: 'pointer', transition: 'all 300ms ease-in-out', '&:hover': { color: utility.darkMode ? '#aaf' : '#3f51b5', letterSpacing: '1px' } }


  return (
    <>
      <SnackBarMsg msg={msg} setMsg={setMsg} />

      {msg.hasMsg && <Container sx={{ mazWidth: '10rem', display: 'flex', justifyContent: 'center' }}>
        <Alert severity="info" sx={{ mt: 1 }}>
          <AlertTitle>{heading}</AlertTitle>
          {message}
        </Alert>
      </Container>}





      <Paper sx={{ maxWidth: '45rem', mx: 'auto', px: 1 }}>


        {/* ------------------- Change Email or Name ------------------- */}
        <Typography component='h2'
          onClick={() => setShowEmailOrNameUpdateField(prev => !prev)}
          sx={headerStyle}>
          Change Email or Name
        </Typography>

        {showEmailOrNameUpdateField && <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          {emailOrNameUpdateForm}
        </Box>}
        {/* ------------------------------------------------------------ */}
        <Divider sx={{ my: 1.5 }} />

        {/* ----------------------  Reset Password  --------------------- */}
        <Typography component='h2'
          onClick={() => setShowPasswordUpdateField(prev => !prev)}
          sx={headerStyle}>
          Reset Password
        </Typography>

        {showPasswordUpdateField && <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          {passwordUpdateForm}
        </Box>}
        {/* -------------------------------------------------------------- */}
        <Divider sx={{ my: 1.5 }} />

        <List>
          <Typography component='h2'
            onClick={() => setShowMessageSettings(prev => !prev)}
            sx={headerStyle}>
            show new Message Popup?
          </Typography>

          {showMessageSettings && <Box sx={{ mx: { xs: '5px', sm: '1rem' }, my: '1rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Typography sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>Control whether a popup should appear when there is a new Message?
            </Typography>
            <Switch checked={popupSettings} onClick={() => toggleMessagePopup(setPopupSettings, setMsg)} />
          </Box>}
        </List>

      </Paper>
    </>
  )
}

export default Settings;