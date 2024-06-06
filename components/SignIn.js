import { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../reducers/user';
import Image from 'next/image';
import styles from '../styles/SignIn.module.css';

function SignIn() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

  // Redirect to /home if logged in
  const router = useRouter();
  if (user.token) {
    router.push('/');
  }

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    fetch('http://localhost:3000/users/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    }).then(response => response.json())
      .then(data => {
        data.result && dispatch(login({ token: data.token, firstName: data.firstName, username: data.username }));
      });
  };

  return (
    <div className={styles.container}>
      <Image src="/logo.png" alt="Logo" width={50} height={50} />
      <h3 className={styles.title}>Connect to Hackatweet</h3>
      <input type="text" className={styles.input} onChange={(e) => setUsername(e.target.value)} value={username} placeholder="Username" />
      <input type="password" className={styles.input} onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Password" />
      <button className={styles.button} onClick={() => handleSubmit()}>Sign in</button>
    </div>
  );
}

export default SignIn;
