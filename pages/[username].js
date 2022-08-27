import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router';
import axios from 'axios';
import cookie from 'js-cookie';
import { parseCookies } from 'nookies';

import baseUrl from '../utils/baseUrl';
import CardPost from '../components/Post/CardPost';
import { NoProfile, NoProfilePosts } from '../components/Layout/Nodata';
import ProfileTab from '../components/profile/ProfileTab';
import { PostDeleteToastr } from '../components/Layout/Toastr';
import { Box, Container, Paper } from '@mui/material';

import ProfileHeader from '../components/profile/ProfileHeader';
import Followers from '../components/profile/Followers';
import Following from '../components/profile/Following';
import UpdateProfile from '../components/profile/UpdateProfile';
import Settings from '../components/profile/Settings';
import SocketOperation from '../components/profile/SocketOperation';



const ProfilePage = ({ followerLength, followingLength, profile, errorLoading, user, userFollowStats }) => {

  if (errorLoading) return <NoProfile />;

  const socket = useRef();


  const router = useRouter();
  const { username } = router.query;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeItem, setActiveItem] = useState('profile');
  const [showToastr, setShowToastr] = useState(false);
  const [loggedUserFollowStats, setUserFollowStats] = useState(userFollowStats);

  const ownAccount = profile._id === user._id;

  const handleItemClick = item => setActiveItem(item);

  const token = cookie.get('token');

  useEffect(() => {
    const getPosts = async () => {

      const url = `${baseUrl}/profile/posts/${username}`;
      const header = { headers: { Authorization: token } };

      setLoading(true)

      try {
        const res = await axios.get(url, header);

        if (res.data.status !== 'ok') throw new Error(res.data.message);
        setPosts(res.data.data);

      } catch (error) { console.log(error.message) }

      setLoading(false)
    }

    getPosts();

  }, [router.query.username]);

  // console.table(posts)

  useEffect(() => {
    showToastr && setTimeout(() => {
      setShowToastr(false)
    }, 3000);
  }, [showToastr])

  const getUsersPosts = posts.map(post => (
    <Box key={post._id} sx={{ my: 1 }}>
      <CardPost
        post={post}
        user={user}
        setPosts={setPosts}
        setShowToastr={setShowToastr}
        loading={loading} />
    </Box>
  ))

  //NEED TO FIX IT
  return (
    <>
      <SocketOperation user={user} socket={socket}>


        <Container sx={{
          mt: 5,
          maxWidth: { xs: '100%', sm: '95%', md: '80%', lg: '70%', xl: '65%' }
        }} >
          {showToastr && <PostDeleteToastr />}

          <Box>
            <ProfileTab
              activeItem={activeItem}
              handleItemClick={handleItemClick}
              followerLength={followerLength}
              followingLength={followingLength}
              ownAccount={ownAccount}
              loggedUserFollowStats={loggedUserFollowStats}
            />
          </Box>

          {activeItem === 'profile' && (
            <>
              <ProfileHeader
                profile={profile}
                ownAccount={ownAccount}
                loggedUserFollowStats={loggedUserFollowStats}
                setUserFollowStats={setUserFollowStats}
              />

              {posts.length > 0 ? (

                getUsersPosts

              ) : <Box sx={{ display: 'flexbox', justifyContent: 'center' }}>
                <Container>
                  <NoProfilePosts />
                </Container>

              </Box>}
              {/* </Box> */}
            </>
          )}

          {/* <Box> */}

          {activeItem === 'followers' && (
            <Box>
              <Followers user={user}
                setUserFollowStats={setUserFollowStats}
                profileUserId={profile._id}
                loggedUserFollowStats={loggedUserFollowStats}
                setActiveItem={setActiveItem}
              />
            </Box>)}

          {activeItem === 'following' && (
            <Following user={user}
              setUserFollowStats={setUserFollowStats}
              profileUserId={profile._id}
              loggedUserFollowStats={loggedUserFollowStats}
              setActiveItem={setActiveItem}
            />

          )}


          {activeItem === 'updateProfile' && <UpdateProfile profile={profile} />}
          {activeItem === 'settings' && <Settings newMessagePopup={user.newMessagePopup} />}

          {/* </Box> */}
        </Container>
      </SocketOperation>
    </>
  )
}

export const getServerSideProps = async ctx => {
  try {
    const { username } = ctx.query;
    const { token } = parseCookies(ctx);

    const url = `${baseUrl}/profile/${username}`;
    const header = {
      headers: { Authorization: token }
    };
    const res = await axios.get(url, header);

    if (res.data.status !== 'ok') throw new Error(res.data.message);


    const { followerLength, followingLength, profile } = res.data.data;


    return { props: { followerLength, followingLength, profile } };
  } catch (error) {
    return { props: { errorLoading: true } };
  }
};

export default ProfilePage;








// ProfilePage.getInitialProps = async ctx => {
//   const { username } = ctx.query;
//   const { token } = parseCookies(ctx);

//   try {
//     const url = `${baseUrl}/profile/${username}`;
//     const header = {
//       headers: { Authorization: token }
//     };
//     const res = await axios.get(url, header);

//     if (res.data.status !== 'ok') throw new Error(res.data.message);

//     const { followerLength, followingLength, profile } = res.data.data;


//     return { followerLength, followingLength, profile };

//   } catch (error) {
//     return { errorLoading: true }
//   }
// }


