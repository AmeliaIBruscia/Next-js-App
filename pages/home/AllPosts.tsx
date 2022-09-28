import React, { useState, useEffect } from 'react'
import ReactDOM from "react-dom";
import { Amplify, API, Auth, withSSRContext, Analytics } from 'aws-amplify';
import Head from 'next/head';
import { listPosts } from '../../src/graphql/queries';
import styles from '../../styles/Home.module.css';
import Link from 'next/link'
import awsExports from '../../src/aws-exports';
import Popup from 'reactjs-popup';
import { deletePost, updatePost, createPost } from '../../src/graphql/mutations';

Amplify.configure({ ...awsExports, ssr: true });

type Post = {
  _id: String,
  user: String,
  text: String
}

  export async function getStaticProps({ params }) {
    const res = await fetch('https://cat-fact.herokuapp.com/facts/')
    const posts = await res.json();
    return {
      props: {
        posts
      }
    };
  }

export default function MyPosts({ posts = [] }) {


  return (
    <div className={styles.container}>
        <button className={styles.standardButton} type="button" onClick={() => Auth.signOut()}>
            Sign out
        </button>
        <button className={styles.standardButton} type="button">
           <Link type="button" href="/">Back to Home</Link>
        </button>
      <Head>
        <title>My Posts</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.posts}>Browse Posts</h1>
        <div className={styles.allPostGrid}>
        {posts.map((post: Post, i) => (
            <div className={styles.postCard} key={post.id}>
              <h3 className={styles.userTitle}>
                User: {i}
              </h3>
              <h2>Cat Fact #{i}</h2>
              <p>{post.text}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}