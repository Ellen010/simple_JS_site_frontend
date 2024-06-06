import Head from 'next/head';
import SignIn from '../components/SignIn';

function SignInPage() {
  return (
    <>
      <Head>
        <title>Sign-in / Hackatweet</title>
      </Head>
      <SignIn />
    </>
  );
}

export default SignInPage;
