import { useDispatch, useSelector } from 'react-redux';
import { likeTweet, deleteTweet } from '../reducers/tweets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Image from 'next/image';
import Moment from 'react-moment';
import styles from '../styles/Tweet.module.css';

function Tweet(props) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  const handleLike = () => {
    fetch('http://localhost:3000/tweets/like', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: user.token, tweetId: props._id }),
    }).then(response => response.json())
      .then(data => {
        data.result && dispatch(likeTweet({ tweetId: props._id, username: user.username }));
      });
  };

  const handleDelete = () => {
    fetch('http://localhost:3000/tweets', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: user.token, tweetId: props._id }),
    }).then(response => response.json())
      .then(data => {
        data.result && dispatch(deleteTweet(props._id));
      });
  };

  let likeStyle = {};
  console.log(props.likes.some(e => e.username === user.username));
  if (props.likes.some(e => e.username === user.username)) {
    likeStyle = { 'color': '#f91980' };
  }

  const formattedContent = props.content.split(' ').map((word, i) => {
    if (word.startsWith('#') && word.length > 1) {
      return <span key={i} style={{ fontWeight: 'bold' }}><Link href={`/hashtag/${word.slice(1)}`}>{word}</Link> </span>;
    }
    return word + ' ';
  });

  return (
    <div className={styles.container}>
      <div className={styles.userInfo}>
        <Image src="/avatar.png" alt="Avatar" width={46} height={46} className={styles.avatar} />
        <p className={styles.content}>
          <span className={styles.name}>{props.author.firstName}</span>
          {' '}
          <span className={styles.greyText}>@{props.author.username} · <Moment className={styles.greyText} fromNow ago>{props.createdAt}</Moment></span>
        </p>
      </div>

      <p>{formattedContent}</p>

      <FontAwesomeIcon icon={faHeart} onClick={() => handleLike()} className={styles.like} style={likeStyle} />
      <span style={likeStyle}>{props.likes.length}</span>

      {props.author.username === user.username && <FontAwesomeIcon icon={faTrashCan} onClick={() => handleDelete()} className={styles.delete} />}
    </div>
  );
}

export default Tweet;
