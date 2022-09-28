import { API, Auth, Amplify, Analytics } from 'aws-amplify';
import { createPost } from '../../src/graphql/mutations';
import styles from '../../styles/Home.module.css';
import Head from 'next/head';
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import awsExports from '../../src/aws-exports';

Amplify.configure({ ...awsExports, ssr: true,
  Auth: {
    identityPoolId: '',
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


type user  = {
  attributes: userAttributes,
  username: String
}

type userAttributes = {
  email: String
}

type apiData = {
  data: createPostData
}

type createPostData = {
  createPost: postData
}

type postData = {
  id: String,
  title: String
}

export default function CreatePosts() {

  const [postCreated, setPostCreated] = useState(false);
  const [data, setData] = useState<apiData | null>(null)
  const [user, setUser] = useState<user | null>(null)

  useEffect(() => {
    Auth.currentAuthenticatedUser({bypassCache: false})
    .then(user => setUser(user))
    .catch(err => console.log(err))
  }, [])

  const handleCreatePost = async(event) => {
    event.preventDefault();

    const form = new FormData(event.target);

    console.log(user)
    //await Analytics.record({name: 'Create Post'})
    const attributesPayload: any = {};
    const result: any = await Analytics.updateEndpoint({
      attributes: attributesPayload,
      });

    // if(user) {
    //   try{
    //     const attributesPayload: any = {};
    //     //const userAttributesPayload: any = {}
    //    // attributesPayload["postTitle"] = [form.get('title')];
    //     //attributesPayload["created"] = ["YES"];
    //     // userAttributesPayload["username"] = [user.username]
    //     const result: any = await Analytics.updateEndpoint({
    //     //address: user.attributes.email,
    //     attributes: attributesPayload,
    //     // channelType:'EMAIL',
    //     // optOut: 'NONE',
    //     // userAttributes: userAttributesPayload,
    //     // userId: user.attributes.email,
    //     });
  
    //    //await Analytics.record({name: 'Create Post'})
    //   }
    //   catch ({ errors }){
    //     console.error(...errors);
    //     throw new Error(errors[0].message);
    //   }
    // }
    // else {
    //   throw new Error("User Does not Exist")
    // }

    console.log(user)
  
    try {
      const newData: any = await API.graphql({
        authMode: 'AMAZON_COGNITO_USER_POOLS',
        query: createPost,
        variables: {
          input: {
            title: form.get('title'),
            content: form.get('content')
          }
        }
      });

      setData(newData)
    } catch ({ errors }) {
      console.error(...errors);
      throw new Error(errors[0].message);
    }
  }


  async function handlePostCreated(){
    setPostCreated(true)
  }

  function handleViewPost() {
    console.log(data)

    if(data){
      window.location.href = `/home/posts/${data.data.createPost.id}`;
    }
    else {
      throw new Error("Data does not exist")
    }
  }

  return (
    <div className={styles.container}>
        <button type="button" className={styles.standardButton} onClick={() => Auth.signOut()}>
            Sign out
        </button>
        <button type="button" className={styles.standardButton}>
            <Link type="button" href="/">Back to Home</Link>
        </button>
      <Head>
        <title>Create a Post</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.posts}>Create a Post</h1>
        <div className={styles.postGrid}>
          <div className={styles.postCard}>
              <form onSubmit={handleCreatePost}>
                <fieldset>
                  <legend>Title</legend>
                  <input
                    defaultValue={`Today, ${new Date().toLocaleTimeString()}`}
                    name="title"
                  />
                </fieldset>

                <fieldset>
                  <legend>Content</legend>
                  <textarea
                    defaultValue="I built an Amplify app with Next.js!"
                    name="content"
                  />
                </fieldset>
                <button className={styles.standardButton} onClick={handlePostCreated}>Create Post</button>
              </form>
              {postCreated && 
              <div>
                   <p> Your Post Has Successfully been Created!</p>
                   <button onClick={handleViewPost}> View Post</button>
                   <p>or</p>
                   <button>
                      <Link type="button" href="/home/MyPosts">View All My Posts</Link>
                   </button>
              </div>
              }
          </div>
        </div>
      </main>
    </div>
  );
}
