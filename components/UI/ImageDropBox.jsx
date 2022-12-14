import React from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';


const ImageDropBox = ({
  highlighted,
  setHighlighted,
  inputRef,
  handleChange,
  media,
  setMedia,
  profilePicUrl,
  mediaPreview
}) => {


  const { darkMode } = useSelector(state => state.utility);
  const router = useRouter();


  const signupRoute = router.pathname === "/signup";

  const dragNdrop = <Typography sx={{ textAlign: 'center' }}>
    Drag n Drop or Click to upload image
  </Typography>


  const checkForSignupPage = () => signupRoute ? (

    <Box style={{ cursor: "pointer", width: 'inherit', height: '100%', display: 'grid', gridRow: '1fr', margin: 'auto' }}>
      <AddPhotoAlternateIcon
        sx={{ fontSize: '6rem', margin: 'auto' }}
        onClick={() => inputRef.current.click()}
      />
      {dragNdrop}
    </Box>

  ) : (
    <Box sx={{
      ...(highlighted && { color: "green" }),
      textAlign: "center",
      fontSize: '1.5rem',
      width: 'fit-content',
      display: 'flex',
      flexDirection: 'column',
      objectFit: 'contain',
      mx: 'auto',
    }}>

      <Box component='img'
        src={profilePicUrl}
        alt="Profile pic"
        sx={{
          m: 'auto',
          cursor: "pointer",
          maxHeight: '30rem',
          maxWidth: '25rem',
          width: '100%',
          height: '100%',
        }}
        onClick={() => inputRef.current.click()}
      />
      {dragNdrop}
    </Box>
  );

  const dragEvent = (e, valueToSet) => {
    e.preventDefault();
    setHighlighted(valueToSet);
  };






  return (
    <>
      <Box sx={{ minHeight: '15rem', width: '100%', bgcolor: darkMode ? '#222' : '#eee', ...(highlighted && { border: "1px solid green" }), display: 'grid', gridRow: '1fr' }}>
        <input
          style={{ display: "none" }}
          type="file"
          accept="image/*"
          onChange={handleChange}
          name="media"
          ref={inputRef}
        />

        <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onDragOver={e => dragEvent(e, true)}
          onDragLeave={e => dragEvent(e, false)}
          onDrop={e => {
            dragEvent(e, true);

            const droppedFile = Array.from(e.dataTransfer.files);

            if (droppedFile?.length > 0) {
              setMedia(droppedFile[0]);
            }
          }}
        >
          {media === null ? (
            <>
              <Box sx={{ ...(highlighted && { color: "green" }), width: { sx: '100%', sm: '80%', md: '60%' }, height: '100%' }}>
                {checkForSignupPage()}
              </Box>
            </>
          ) : (
            <Box sx={{ ...(highlighted && { color: "green" }), width: 'inherit', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Box component='img'
                src={mediaPreview}
                alt="Profile pic"
                sx={{ cursor: "pointer", width: '100%', height: '100%', maxHeight: '30rem', maxWidth: '25rem' }}
                onClick={() => inputRef.current.click()}
              />
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}

export default ImageDropBox;