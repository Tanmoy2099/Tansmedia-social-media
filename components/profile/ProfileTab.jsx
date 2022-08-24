

import { Tabs, Tab, Container, Paper } from '@mui/material';
import { tabsClasses } from '@mui/material/Tabs'


function ProfileTab({ activeItem, handleItemClick, followerLength, followingLength, ownAccount, loggedUserFollowStats }) {

  const handleChange = (e, val) => handleItemClick(val);

  const tabStyle = {
    fontSize: { xs: '0.65rem', sm: '0.8rem', md: '1rem' },
    p: { xs: '0.2rem', sm: '0.4rem', lg: '1rem' },
    mx: { xs: '0.1rem', sm: '0.5rem', md: '1rem' },
    minWidth: { xs: '2px' },
    textTransform: 'none'
  }


  return (
    <Container fullwidth='lg' sx={{ my: 2, mx: 0 }}>
      <Paper sx={{ my: 2, maxWidth: 'fit-content', mx: 'auto', padding: { xs: 0, sm: 0.5 }, borderColor: 'divider' }}>
        <Tabs value={activeItem}
          // sx={{ display: 'flex' }}
          aria-label="scrollable auto tabs"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          onChange={handleChange}
          sx={{
            [`& .${tabsClasses.scrollButtons}`]: {
              '&.Mui-disabled': { opacity: 0.3 },
              width: '25px'
            },
          }}
        >

          <Tab label='Profile' value='profile' sx={tabStyle} />
          <Tab label={`${followerLength} Followers`} value='followers' sx={tabStyle} />

          {ownAccount && <Tab label={`${followingLength} Following`} value='following' sx={tabStyle} />}
          {ownAccount && <Tab label='Update Profile' value='updateProfile' sx={tabStyle} />}
          {ownAccount && <Tab label='Settings' value='settings' sx={tabStyle} />}


        </Tabs>
      </Paper>
    </Container>
  );
}



export default ProfileTab;