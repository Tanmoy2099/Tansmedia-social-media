import { Avatar, Box, Skeleton, Typography } from '@mui/material';




const AvatarNameLoader = ({ user, loading }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
      <Box sx={{ margin: 1 }}>
        {loading ? (
          <Skeleton variant="circular">
            <Avatar />
          </Skeleton>
        ) : (
          <Avatar src={user.profilePicUrl} sx={{ height: 25, width: 25 }} />
        )}
      </Box>
      <Box sx={{ width: '100%' }}>
        {loading ? (
          <Skeleton width="100%">
            <Typography>.</Typography>
          </Skeleton>
        ) : (
            <Typography component='body2' >
              {user.name}
            </Typography>
        )}
      </Box>
    </Box>
  )
}

export default AvatarNameLoader;