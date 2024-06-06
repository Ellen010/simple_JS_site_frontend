import Head from 'next/head';
import Login from '../components/Login';

function LoginPage() {
  return (
    <>
      <Head>
        <title>Login / Hackatweet</title>
      </Head>
      <Login />
    </>
  );
}

export default LoginPage;
