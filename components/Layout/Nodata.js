import { Alert, AlertTitle, Box, Button, Container } from "@mui/material";


const alertStructure = (heading = 'Hi!', message = 'Welcome') => <>
  <Container sx={{mazWidth:'10rem', display:'flex', justifyContent:'center'}}>
  <Alert severity="info" sx={{ mt: 1 }}>
    <AlertTitle>{heading}</AlertTitle>
    {message}
  </Alert>
  </Container>
</>;

const buttonStruture = (name = 'button', link = '/') => <>
  <Box sx={{ display: 'flex' }}>
    <Box sx={{ flexGrow: 1 }} />
    <Button variant="contained" href={link} sx={{ my: 1 }}>
      {name}
    </Button>
    <Box sx={{ flexGrow: 1 }} />
  </Box>
</>;


export const NoProfilePosts = () => (
  <>
    {alertStructure("Sorry", "User has not posted anything yet!")}
    {buttonStruture("Go Back")}
  </>
);


export const NoFollowData = ({ followersComponent, followingComponent }) => (
  <>
    {followersComponent ? alertStructure('No follower', `User does not have followers`) : alertStructure('Not following', `User does not follow any users`)}
  </>
);


export const NoMessages = () => alertStructure('Sorry', 'You have not messaged anyone yet.Search above to message someone!');
export const NoPosts = () => alertStructure("Hey!", "No Posts. Make sure you have followed someone.");
export const NoNotifications = () => alertStructure('Sorry', 'No Notifications');
export const NoProfile = () => alertStructure("Hey!", "No Profile Found.");
export const NoPostFound = () => alertStructure('Hey!', 'No Post Found.');
