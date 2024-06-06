import Head from 'next/head';
import Home from '../components/Home';

function Index() {
  return (
    <>
      <Head>
        <title>Home / Hackatweet</title>
      </Head>
      <Home />
    </>
  );
}

export default Index;
