import { useState } from 'react';

import cookie from 'js-cookie';
import axios from 'axios';
import { Box, Popover } from '@mui/material';

import PlaceHolderGroup from '../Layout/CustomLoader/PlaceHolderGroup';
import catchErrors from '../../utils/catchErrors';
import baseUrl from '../../utils/baseUrl';
import Link from 'next/link';

const LikesList = ({ postId, likes }) => {

  const [LikesData, setLikesData] = useState([]);
  const [likeAnchor, setLinkAnchor] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = cookie.get('token');

  const getLikesList = async () => {
    setLoading(true);

    const url = `${baseUrl}/posts/like/${postId}`;
    const headers = { Authorization: token };
    try {

      const res = await axios.get(url, { headers });
      if (res.data.status !== 'ok') throw new Error(res.data.message)
      setLikesData(res.data.data)

    } catch (error) {
      alert(catchErrors(error))
    }
    setLoading(false);
  }



  return (
    <>
      <Box variant='span'
        sx={{ width: 'fit-content', ml: 1, cursor: 'pointer' }}
        onClick={e => {
          setLinkAnchor(e.currentTarget);
          getLikesList()
        }}
      >
        {`${likes.length} ${likes.length === 1 ? 'like' : 'likes'}`}
      </Box>


      <Popover
        open={Boolean(likeAnchor)}
        anchorEl={likeAnchor}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        // transformOrigin={{
        //   vertical: 'right',
        //   horizontal: 'bottom'
        // }}
        onClose={() => {
          setLinkAnchor(null);
          setLikesData([]);
        }}>

        <Box sx={{
          padding: '0.1rem',
          maxHeight: '10rem',
          width: '10rem',
          display: 'flex',
          flexDirection: 'column',
          overflow:'auto'
        }}>
          {
            LikesData.map(like => <Link href={`/${like.user.username}`} 
            key={like._id}>
              <PlaceHolderGroup 
              user={like.user}
              loading={loading} />
            </Link>)
          }
        </Box>
      </Popover>
    </>
  )
}

export default LikesList;