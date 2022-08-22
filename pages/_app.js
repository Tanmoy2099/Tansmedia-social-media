

import { Provider } from 'react-redux';
import axios from 'axios';
import { parseCookies, destroyCookie } from 'nookies';

import '../styles/globals.css';

import Layout from '../components/Layout/Layout';
import store from '../Store/Store';
import { redirectUser } from '../utils/authUser';
import baseUrl from '../utils/baseUrl';


function MyApp({ Component, pageProps }) {


  return <>
    <Provider store={store}>
        <Layout {...pageProps}>
          <Component {...pageProps} />
        </Layout>
    </Provider>
  </>;
}


MyApp.getInitialProps = async ({ Component, ctx }) => {

  const { token } = parseCookies(ctx);

  let pageProps = {};

  const protectedRoutes = ctx.pathname === '/'
    || ctx.pathname === '/[username]'
    || ctx.pathname === '/notifications'
    || ctx.pathname === '/posts/[postId]'
    || ctx.pathname === '/messages'
    ;


  if (!token) {
    protectedRoutes && redirectUser(ctx, '/login');
  } else {
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    const url = `${baseUrl}/user`;
    const header = { headers: { Authorization: token } };

    try {
      const res = await axios.get(url, header);

      if (res.data.status !== 'ok') throw new Error(res.data.message);

      const { user, userFollowStats } = res.data.data;

      if (user) !protectedRoutes && redirectUser(ctx, '/');

      pageProps.user = user;
      pageProps.userFollowStats = userFollowStats;

    } catch (error) {
      destroyCookie(ctx, 'token');
      redirectUser(ctx, '/login');
    }

  }
  return { pageProps }
}


export default MyApp;