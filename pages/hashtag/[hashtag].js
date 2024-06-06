import { useRouter } from 'next/router';
import Head from 'next/head';
import Hashtag from '../../components/Hashtag';

function HashtagPage() {
  const router = useRouter();
  const { hashtag } = router.query;

  return (
    <>
      <Head>
        <title>#{hashtag} / Hackatweet</title>
      </Head>
      <Hashtag />
    </>
  );
}

export default HashtagPage;
