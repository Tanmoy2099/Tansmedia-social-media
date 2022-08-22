
import { Paper, List, Typography } from "@mui/material";
import MsgAlertCard from "./MsgAlertCard";

const IncomingMsgArea = ({ data, onClick }) => {


  const searchResult = data.map(e => <MsgAlertCard key={e._id} data={e} onClick={onClick} />);


  const PaperContainerCss = {
    zIndex: 9,
    display: 'flex',
    height: 'fit-content',
    maxHeight: '50vh',
    width: '100%',
    position: 'absolute',
    // right: { xs: '1rem', sm: '4rem' },
    marginTop: '0.5rem',
    overflow: 'auto',
    color: 'white'
  }


  return (
    <Paper sx={PaperContainerCss}>
      <List sx={{
        width: '100%',
        px: 1,
        height: '100%',
        bgcolor: '#3f51b5'
      }}>
        {data.length ? searchResult : <Typography sx={{ textAlign: 'center' }}>No result</Typography>}
      </List>
    </Paper>
  )
}

export default IncomingMsgArea;