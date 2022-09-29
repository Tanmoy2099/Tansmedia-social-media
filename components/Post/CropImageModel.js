import { Box, IconButton, Typography, Tooltip } from '@mui/material';
import { useState, useEffect } from 'react'
import Cropper from "react-cropper";

import RedoIcon from '@mui/icons-material/Redo';
import CropIcon from '@mui/icons-material/Crop';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import OpenWithIcon from '@mui/icons-material/OpenWith';

const CropImageModel = ({ mediaPreview, setMediaPreview, setMedia, setShowModal }) => {

  const [cropper, setCropper] = useState();


  const getCropData = () => {
    if (cropper) {
      const media = cropper.getCroppedCanvas().toDataURL()
      setMedia(media);
      if (setMediaPreview) setMediaPreview(media);

      cropper.destroy();
    }

    setShowModal(false);
  };



  useEffect(() => {
    window.addEventListener("keydown", ({ key }) => {
      if (cropper) {
        if (key === "m") cropper.setDragMode("move");
        if (key === "c") cropper.setDragMode("crop");
        if (key === "r") cropper.reset();
      }
    });
  }, [cropper]);


  return (
    <>
      <Box sx={{ display: 'Grid', gridTemplateColumns: '8fr 1fr', mb: '2rem', width: '100%', height: { xs: '60vh', sm: '80vh' } }}>

        <Box sx={{ height: '100%' }}>
          <Cropper
            style={{ height: '100%', width: '100%' }}
            cropBoxResizable
            zoomable
            highlight
            responsive
            guides
            dragMode="move"
            initialAspectRatio={1}
            preview=".img-preview"
            src={mediaPreview}
            viewMode={1}
            minCropBoxHeight={10}
            minContainerWidth={10}
            background={false}
            autoCropArea={1}
            checkOrientation={false}
            onInitialized={cropper => setCropper(cropper)}
          />
        </Box>
        {/* <Box> */}
        {/* <div>

            <Typography sx={{ textAlign: 'center' }}>
              Result
            </Typography>



            <div
              style={{
                width: "100%",
                height: "300px",
                display: "inline-block",
                padding: "10px",
                overflow: "hidden",
                boxSizing: "border-box"
              }}
              className="img-preview"
            />

          </div> */}

        {/* <Box sx={{ flexGrow: 1 }} /> */}
        <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'space-evenly', height: '100%' }}>
          <Tooltip title='Reset (R)' placement="left-start">
            <IconButton
              onClick={() => cropper && cropper.reset()} >
              <RedoIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title='Move (M)' placement="left-start">
            <IconButton onClick={() => cropper && cropper.setDragMode("move")} >
              <OpenWithIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title='Cropbox (C)' placement="left">
            <IconButton onClick={() => cropper && cropper.setDragMode("crop")} >
              <CropIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title='Close' placement="left-end">
            <IconButton onClick={() => setShowModal(false)} >
              <CancelIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title='Done' placement="left-end">
            <IconButton
              onClick={getCropData}>
              <CheckIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      {/* </Box> */}
    </>
  )
}

export default CropImageModel;