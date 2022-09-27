import React from 'react'
import { Amplify, API, withSSRContext } from 'aws-amplify';
import Head from 'next/head';
import { useRouter } from 'next/router';
import awsExports from '../../../src/aws-exports';
import { deletePost } from '../../../src/graphql/mutations';
import { getPost, listPosts } from '../../../src/graphql/queries';
import styles from '../../../styles/Home.module.css';
import Link from 'next/link'
import Popup from 'reactjs-popup';

Amplify.configure({ ...awsExports, ssr: true,  Auth: {
  identityPoolId: 'us-east-1:c68a59e3-65af-412a-9bb6-1b2bfdd751ac',
  region: 'us-east-1'
} });

export async function getStaticPaths() {
  const SSR = withSSRContext();
  const { data } = await SSR.API.graphql({ query: listPosts });
  const paths = data.listPosts.items.map((post) => ({
    params: { id: post.id }
  }));

  return {
    fallback: true,
    paths
  };
}

export async function getStaticProps({ params }) {
  const SSR = withSSRContext();
  const { data } = await SSR.API.graphql({
    query: getPost,
    variables: {
      id: params.id
    }
  });

  return {
    props: {
      post: data.getPost
    }
  };
}

export default function Post({ post }) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Loading&hellip;</h1>
      </div>
    );
  }

  async function handleDelete() {
    try {
      await API.graphql({
        authMode: 'AMAZON_COGNITO_USER_POOLS',
        query: deletePost,
        variables: {
          input: { id: post.id }
        }
      });

      window.location.href = '/home/MyPosts';
    } catch ({ errors }) {
      console.error(...errors);
      throw new Error(errors[0].message);
    }
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>{post.title}</h1>

        <p className={styles.description}>{post.content}</p>
      </main>

      <footer className={styles.footer}>
        <button className={styles.standardButton}>
         <Link type="button" href="/home/MyPosts">Back to My Posts</Link>
        </button>
        <Popup trigger={<button className={styles.deleteButton}> Delete </button>}
           position="right center">
             <div className={styles.popUp}>
              <div className={styles.postGrid}>
                    <div>Are you sure you want to delete this item</div>
              </div>
              <button className={styles.deleteButton} onClick={handleDelete}>Yes, Delete</button>
              </div>
        </Popup>
      </footer>
    </div>
  );
}