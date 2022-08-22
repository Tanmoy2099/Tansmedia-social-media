
import _ from 'lodash';
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useDispatch } from 'react-redux';

import { utilityActions } from "../../Store/Utility-slice";


const ToggleButton = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "end",
        ml:1.5
      }}
    >

      <Tooltip
        title={`${_.capitalize(theme.palette.mode) } mode`} >
        <IconButton onClick={() => dispatch(utilityActions.toggleDarkMode())} color="inherit">
          {theme.palette.mode === "dark" ? (
            <Brightness7Icon />
          ) : (
            <Brightness4Icon />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ToggleButton;
