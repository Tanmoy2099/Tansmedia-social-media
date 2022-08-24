import { useState } from 'react';
import { useRouter } from 'next/router';

import { Box, Button, TextField, Typography, Container, CircularProgress, InputAdornment } from '@mui/material';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

import { submitPasswordResetToken } from '../../utils/authUser';
import SnackBarMsg from '../../components/UI/SnackBarMsg';


const ResetToken = () => {

  const router = useRouter();
  const { resetToken } = router.query;


  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [formLoading, setFormLoading] = useState(false);

  const initialValue = { password: false, confirmPassword: false };
  const [isTouched, setIsTouched] = useState(initialValue);
  const [isVisible, setIsVisible] = useState(initialValue);

  const initialMsg = { hasMsg: false, type: '', message: '' };
  const [msg, setMsg] = useState(initialMsg);



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setPassword(password.trim());
    setConfirmPassword(confirmPassword.trim());

    if (password !== confirmPassword) {
      setMsg({ hasMsg: true, type: 'error', message: 'confirm password not matching' })
    }

    const data = { password, confirmPassword }
    setFormLoading(true);

    await submitPasswordResetToken(resetToken, data, setMsg)

    setPassword('');
    setConfirmPassword('');

    setFormLoading(false)
  }




  const InputFsStyle = { style: { fontSize: 18 } };
  const helpingText = text => <Typography component="span" variant="body1">{text}</Typography>


  return (
    <>
      <Container component="main" maxWidth="md" sx={{ mb: 2 }}>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <SnackBarMsg msg={msg} setMsg={setMsg} />

          <Typography component="h3" variant="h4">
            Reset Password
          </Typography>

          <Box component="form" sx={{ mt: 1 }}
            color='paper'
            onSubmit={handleSubmit} >

            {/* Password */}
            <TextField
              margin="normal"
              variant="outlined"
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
              value={password}
              error={!(password.trim()).length > 7 && isTouched.password}
              helperText={!(password.trim()).length > 7 && isTouched.password ? helpingText('Password Should have more than 7 characters') : ''}
              onBlur={() => setIsTouched(touched => ({ ...touched, password: true }))}
              onChange={e => setPassword(e.target.value)}
            />

            {/* Confirm password */}
            <TextField
              margin="normal"
              variant="outlined"
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
              value={confirmPassword}
              error={password !== confirmPassword && isTouched.confirmPassword}
              helperText={password !== confirmPassword && isTouched.confirmPassword ? helpingText('Not matching with the password') : ''}
              onBlur={() => setIsTouched(touched => ({ ...touched, confirmPassword: true }))}
              onChange={e => setConfirmPassword(e.target.value)}
            />

            <Button
              disabled={!(password && password === confirmPassword) || formLoading}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, fontSize: '1.1rem', textTransform: 'none' }} >
              {formLoading ? <CircularProgress fontSize="60%" color='success' /> : 'Confirm'}
            </Button>


          </Box>
        </Box>
      </Container>
    </>
  )
}

export default ResetToken;