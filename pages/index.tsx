
import React from 'react'
import { withAuthenticator, Authenticator } from '@aws-amplify/ui-react';
import { Amplify, Analytics, Auth, withSSRContext } from 'aws-amplify';
import Head from 'next/head';
import awsExports from '../src/aws-exports';
import styles from '../styles/Home.module.css';
import { SignIn } from 'aws-amplify-react';
import Link from 'next/link'
import Image from 'next/image';

Amplify.configure({ ...awsExports, ssr: true,
  Auth: {
    identityPoolId: 'us-east-1:c68a59e3-65af-412a-9bb6-1b2bfdd751ac',
    region: 'us-east-1'
  },
  Analytics: {
    disabled: false,
    autoSessionRecord: true,
    AwsPinpoint: {
      appId: 'f7e1c09cf4764fa290ff7e09617a8019',
      region: 'us-east-1'
    }
  }
})

//Auth.configure({ mandatorySignIn: false});

// class MySignIn extends SignIn {
//   render() {
//     <div className={styles.signIn}>
//       <button>Test</button>
//     </div>
//   }
// }

 function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.align}>
      <h1 className={styles.title}>Home</h1>
        <Image
          className={styles.homeImage} 
          src="/images/house.jpg"
          height={70}
          width={70} 
          alt="house"
        />
      </div>
      <Authenticator>
      <main className={styles.main}>
        <div className={styles.grid}>
          <div className={styles.card}>
                <button className={styles.homeButton}type="button">
                  <Link type="button" href="/home/CreatePosts">Create a Post</Link>
                </button>
                <button className={styles.homeButton}type="button">
                   <Link type="button" href="/home/MyPosts">View My Posts</Link>
                </button>
                <button className={styles.homeButton}type="button">
                  <Link type="button" href="/home/AllPosts">Browse Posts</Link>
                </button>
                <button className={styles.homeButton}type="button" onClick={() => Auth.signOut()}>
                  Sign out
                </button>
          </div>
        </div>
      </main>
      </Authenticator>
    </div>
  );
}

export default withAuthenticator(Home)