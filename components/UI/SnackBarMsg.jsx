// import { Alert, AlertTitle, Snackbar } from '@mui/material';
import _ from 'lodash';

import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";




// const SnackBarMsg = ({ msg, setMsg }) => {
//   const { type, hasMsg, message } = msg;

//   const initialMsg = { hasMsg: false, type: 'info', message: '' };

//   const onClose = () => setMsg(initialMsg);

//   let msgType = 'info'
//   if (type === 'error') msgType = 'error'
//   if (type === 'success') msgType = 'success'
//   if (type === 'warning') msgType = 'warning'

//   return <>
//     <Snackbar open={hasMsg} autoHideDuration={10000} onClose={onClose}>

//       <Alert sx={{ width: '100%', fontSize: '1.2rem' }}
//         onClose={onClose}
//         severity={msgType}
//       >
//         <AlertTitle>{_.capitalize(type || 'error')}</AlertTitle>
//         {message}
//       </Alert>
//     </Snackbar>
//   </>
// }




const ContainerForToastr = ({ children }) => (
  <ToastContainer
    position="bottom-center"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover={false}
  >
    {children}
  </ToastContainer>
);



const customToastr = ({ msg, setMsg }) => {

  const { type, hasMsg, message } = msg;

  if (!hasMsg) return;

  const initialMsg = { hasMsg: false, type: 'info', message: '' };
  const resetMsg = () => setMsg(initialMsg)

  const options = {
    position: "bottom-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    onClose: resetMsg()
  }

  let setMessage;

  if (type === 'info') setMessage = toast.info(message, options)
  if (type === 'error') setMessage = toast.error(message, options)
  if (type === 'success') setMessage = toast.success(message, options)
  if (type === 'warning') setMessage = toast.warning(message, options)

  return (
    <ContainerForToastr>
      {setMessage}
    </ContainerForToastr>
  );

}



export default customToastr;  // sent as 'SnackBarMsg'