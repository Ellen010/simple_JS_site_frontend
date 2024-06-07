import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../reducers/user';
import { loadTweets } from '../reducers/tweets';
import { useRouter } from 'next/router';
import styles from '../styles/Hashtag.module.css';
import Link from 'next/link';
import Tweet from './Tweet';
import Trends from './Trends';
import Image from 'next/image';

function Hashtag() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const tweetsData = useSelector((state) => state.tweets.value);

  // Redirect to /login if not logged in
  const router = useRouter();
  const { hashtag } = router.query;
  if (!user.token) {
    router.push('/login');
  }

  const [query, setQuery] = useState('#');
  const [rotate, setRotate] = useState(false); 

  useEffect(() => {
    if (!hashtag) {
      return;
    }

    setQuery('#' + hashtag);

    fetch(`https://simple-js-site-backend.vercel.app/tweets/hashtag/${user.token}/${hashtag}`)
      .then(response => response.json())
      .then(data => {
        data.result && dispatch(loadTweets(data.tweets));
      });
  }, [hashtag]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotate(prevRotate => !prevRotate); 
    }, 30000); 

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    if (query.length > 1) {
      router.push(`/hashtag/${query.slice(1)}`);
    }
  };

  const tweets = tweetsData.map((data, i) => {
    return <Tweet key={i} {...data} />;
  });

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <div>
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Logo"
              width= "50px" 
              height= "50px"
              className={`${styles.logo} ${rotate ? styles.rotate : " "}`}
            />
          </Link>
        </div>
        <div>
          <div className={styles.userSection}>
            <div>
              <Image src="/avatar.png" alt="Avatar" width={46} height={46} className={styles.avatar} />
            </div>
            <div className={styles.userInfo}>
              <p className={styles.name}>{user.firstName}</p>
              <p className={styles.username}>@{user.username}</p>
            </div>
          </div>
          <button onClick={() => { router.push('/login'); dispatch(logout()); }} className={styles.logout}>Logout</button>
        </div>
      </div>

      <div className={styles.middleSection}>
        <h2 className={styles.title}>Hashtag</h2>
        <div>
          <div className={styles.searchSection}>
            <input
              type="text"
              onChange={(e) => setQuery('#' + e.target.value.replace(/^#/, ''))}
              onKeyUp={(e) => e.key === 'Enter' && handleSubmit()}
              value={query}
              className={styles.searchBar}
            />
          </div>
          {tweets.length === 0 && <p className={styles.noTweet}>No tweets found with #{hashtag}</p>}
          {tweets}
        </div>
      </div>

      <div className={styles.rightSection}>
        <h2 className={styles.title}>Trends</h2>
        <Trends />
      </div>
    </div>
  );
}

export default Hashtag;
