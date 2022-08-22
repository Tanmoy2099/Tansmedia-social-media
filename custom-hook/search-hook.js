
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import { searchActions } from '../Store/Search-slice';
import cookie from 'js-cookie';
let cancel;

export const useSearchHook = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();


  const handleChange = useCallback(async (url, text) => {

    if (text.trim().length === 0) {
      dispatch(searchActions.resetSearch());
      return;
    };


    setIsLoading(true);
    try {
      cancel && cancel()

      const CancelToken = axios.CancelToken;
      const token = cookie.get('token');

      const res = await axios.get(url, {
        headers: { Authorization: token },
        cancelToken: new CancelToken(canceler => { cancel = canceler })
      });

      if (res.data.status !== 'ok') throw new Error(res.data.message);
      dispatch(searchActions.setSearch(res.data.data));

    } catch (error) {
      // return;
      console.log('Error searching', (error.message));

    } finally {
      setIsLoading(false);
      return;
    }




  }, []);

  return { handleChange, isLoading };
};
