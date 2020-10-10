import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonModal,
} from '@ionic/react';
import './profile.css';
import EditPost from './editPost'

const PostPreview = ({ post, onClick }) => (
  <div onClick={onClick} to={"/edit/"+post.id}
    key={post.id}
    className={"photo-grid__photo" + (post.products.length!==0 ? " published" : "")}
    style={{ backgroundImage: `linear-gradient(white, white), url('${ post.media_url }')` }}
  ></div>
)

const Profile = ({ username, posts, updatePost}) => {
  const [ openedPost, setOpenedPost ] = useState( false );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Profile</IonTitle>
            {/* <IonButtons slot="end">
              <IonButton>
                <IonIcon slot="icon-only" icon={cogOutline} />
              </IonButton>
            </IonButtons> */}
          </IonToolbar>
        </IonHeader>
        <IonGrid style={{maxWidth: 900}}>
          <IonRow>
            {posts.map((post, index) => (
              <IonCol size="4" key={index}>
                <PostPreview post={post} onClick={ () => setOpenedPost(index) }/>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
        { posts[openedPost] ? <IonModal isOpen={posts[openedPost]} onDidDismiss={() => setOpenedPost(null)}>
          <EditPost post={posts[openedPost]} updatePost={updatePost} closePost={() => setOpenedPost(null)} />
        </IonModal> : null}
      </IonContent>
    </IonPage>
  );
}
export default Profile;
