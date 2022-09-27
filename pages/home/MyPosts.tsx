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
  title: String,
  id: String,
  content: String
}


export async function getServerSideProps({ req }) {
  const SSR = withSSRContext({ req });
  const response = await SSR.API.graphql({ query: listPosts });

  return {
    props: {
      posts: response.data.listPosts.items
    }
  };
}


export default function MyPosts({ posts = [] }) {

  async function handleUpdatePost() {

    // try {
    //       await API.graphql({
    //         authMode: 'AMAZON_COGNITO_USER_POOLS',
    //         query: createPost,
    //         variables: {
    //           input: {
    //             title: "test",
    //             content: "test"
    //           }
    //         }
    //       });
    
    //       window.location.href = '/home/MyPosts';
    //     } catch ({ errors }) {
    //       console.error(...errors);
    //       throw new Error(errors[0].message);
    //     }

  }
  // async function handleDelete(postId) {
  //   try {
  //     await API.graphql({
  //       authMode: 'AMAZON_COGNITO_USER_POOLS',
  //       query: deletePost,
  //       variables: {
  //         input: { id: postId }
  //       }
  //     });

  //     window.location.href = '/home/MyPosts';
  //   } catch ({ errors }) {
  //     console.error(...errors);
  //     throw new Error(errors[0].message);
  //   }
  // }

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
        <h1 className={styles.posts}>My Posts</h1>

        <p className={styles.description}>
          <code className={styles.code}>{posts.length}</code>
          posts
        </p>
        <button className={styles.standardButton}>
          <Link type="button" href="/home/CreatePosts">Create a Post</Link>
        </button>

        <div className={styles.postGrid}>
          {posts.map((post: Post) => (
            <div className={styles.postCard} key={post.id}>
              <h3>
                <Link href={`/home/posts/${post.id}`}>{post.title}</Link>
              </h3>
              <p>{post.content}</p>
              <button>
                <Link href={`/home/posts/${post.id}`}>View Post</Link>
              </button>
              <button onClick={handleUpdatePost}>Update Post</button>
              <Popup trigger={<button> Delete </button>} 
                position="right center">
                  <div className={styles.popUp}>
                  <div className={styles.postGrid}>
                     <div>Are you sure you want to delete this item</div>
                  </div>
                  <button className={styles.deleteButton}>Yes, Delete</button>
                  </div>
              </Popup>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}