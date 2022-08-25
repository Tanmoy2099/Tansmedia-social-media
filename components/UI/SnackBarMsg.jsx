import { Alert, AlertTitle, Snackbar } from '@mui/material';
import _ from 'lodash';


const SnackBarMsg = ({ msg, setMsg }) => {
  const { type, hasMsg, message } = msg;

  const initialMsg = { hasMsg: false, type: 'info', message: '' };

  const onClose = () => setMsg(initialMsg);

  let msgType = 'info'
  if (type === 'error') msgType = 'error'
  if (type === 'success') msgType = 'success'
  if (type === 'warning') msgType = 'warning'

  return <>
    <Snackbar open={hasMsg}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={10000}
      sx={{ mt: '3rem' }}
      onClose={onClose} >

      <Alert sx={{ width: '100%', fontSize: '1.2rem' }}
        onClose={onClose}
        severity={msgType}
      >
        <AlertTitle>{_.capitalize(type || 'error')}</AlertTitle>
        {message}
      </Alert>
    </Snackbar>
  </>
}

export default SnackBarMsg;