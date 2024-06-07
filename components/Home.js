import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../reducers/user';
import { loadTweets, addTweet } from '../reducers/tweets';
import Link from 'next/link';
import Image from 'next/image';
import LastTweets from './LastTweets';
import Trends from './Trends';
import styles from '../styles/Home.module.css';

function Home() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const [rotate, setRotate] = useState(false); 
  useEffect(() => {
    const interval = setInterval(() => {
      setRotate(prevRotate => !prevRotate); 
    }, 30000); 

    return () => clearInterval(interval);
  }, []);


  // Redirect to /login if not logged in
  const router = useRouter();

  if (!user.token) {
    router.push('/login');
  }

  const [newTweet, setNewTweet] = useState('');

  useEffect(() => {
    if (!user.token) {
      return;
    }

    fetch(`https://novatweet-frontend.vercel.app/tweets/all/${user.token}`)
      .then(response => response.json())
      .then(data => {
        data.result && dispatch(loadTweets(data.tweets));
      });
  }, []);

  const handleInputChange = (e) => {
    if (newTweet.length < 280 || e.nativeEvent.inputType === 'deleteContentBackward') {
      setNewTweet(e.target.value);
    }
  };

  const handleSubmit = () => {
    fetch('https://novatweet-frontend.vercel.app/tweets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: user.token, content: newTweet }),
    }).then(response => response.json())
      .then(data => {
        if (data.result) {
          const createdTweet = { ...data.tweet, author: user };
          dispatch(addTweet(createdTweet));
          setNewTweet('');
        }
      });
  };

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
        <h2 className={styles.title}>Home</h2>
        <div className={styles.createSection}>
          <textarea type="text" placeholder="What's up?" className={styles.input} onChange={(e) => handleInputChange(e)} value={newTweet} />
          <div className={styles.validateTweet}>
            <p>{newTweet.length}/280</p>
            <button className={styles.button} onClick={() => handleSubmit()}>Tweet</button>
          </div>
        </div>
        <LastTweets />
      </div>

      <div className={styles.rightSection}>
        <h2 className={styles.title}>Trends</h2>
        <Trends />
      </div>
    </div >
  );
}

export default Home;