import { useState, useEffect } from 'react'
import { useRouter } from 'next/router';
import axios from 'axios';
import cookie from 'js-cookie';
import { parseCookies } from 'nookies';

import baseUrl from '../utils/baseUrl';
import CardPost from '../components/Post/CardPost';
import { NoProfile, NoProfilePosts } from '../components/Layout/Nodata';
import ProfileTab from '../components/profile/ProfileTab';
import { PostDeleteToastr } from '../components/Layout/Toastr';
import { Box, Container } from '@mui/material';

import ProfileHeader from '../components/profile/ProfileHeader';
import Followers from '../components/profile/Followers';
import Following from '../components/profile/Following';
import UpdateProfile from '../components/profile/UpdateProfile';
import Settings from '../components/profile/Settings';



const ProfilePage = ({ followerLength, followingLength, profile, errorLoading, user, userFollowStats }) => {

  if (errorLoading) return <NoProfile />;

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

      } catch (error) { console.error(error.message) }

      setLoading(false)
    }

    getPosts();

  }, [router.query.username]);

  useEffect(() => {
    showToastr && setTimeout(() => {
      setShowToastr(false)
    }, 3000);
  }, [showToastr])

  const getUsersPosts = posts.map(post => (
    <CardPost key={post._id}
      post={post}
      user={user}
      setPosts={setPosts}
      setShowToastr={setShowToastr}
      loading={loading} />
  ))


  return (
    <>
      {showToastr && <PostDeleteToastr />}
      <Container>
        <ProfileTab
          activeItem={activeItem}
          handleItemClick={handleItemClick}
          followerLength={followerLength}
          followingLength={followingLength}
          ownAccount={ownAccount}
          loggedUserFollowStats={loggedUserFollowStats}
        />
      </Container>

      {activeItem === 'profile' && (
        <>
          <ProfileHeader
            profile={profile}
            ownAccount={ownAccount}
            loggedUserFollowStats={loggedUserFollowStats}
            setUserFollowStats={setUserFollowStats}
          />
          {posts.length > 0 ? getUsersPosts : <>
            <Box sx={{ display: 'flexbox', justifyContent: 'center' }}>
              <Container>
                <NoProfilePosts />
              </Container>
            </Box>
          </>}
        </>
      )}

      {activeItem === 'followers' && (
        <Container>
          <Followers user={user}
            setUserFollowStats={setUserFollowStats}
            profileUserId={profile._id}
            loggedUserFollowStats={loggedUserFollowStats}
          />
        </Container>)}

      {activeItem === 'following' && <Container>
        <Following user={user}
          setUserFollowStats={setUserFollowStats}
          profileUserId={profile._id}
          loggedUserFollowStats={loggedUserFollowStats}
        />
      </Container>}

      <Container>
        {activeItem === 'updateProfile' && <UpdateProfile profile={profile} />}
        {activeItem === 'settings' && <Settings newMessagePopup={user.newMessagePopup} />}
      </Container>
    </>
  )
}

ProfilePage.getInitialProps = async ctx => {
  const { username } = ctx.query;
  const { token } = parseCookies(ctx);

  try {
    const url = `${baseUrl}/profile/${username}`;
    const header = {
      headers: { Authorization: token }
    };
    const res = await axios.get(url, header);

    if (res.data.status !== 'ok') throw new Error(res.data.message);

    return res.data.data;
  } catch (error) {
    return { errorLoading: true }
  }
}



export default ProfilePage;