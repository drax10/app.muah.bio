import React from 'react';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonModal,
  IonButton,
  IonButtons,
  IonLabel,
  IonChip
} from '@ionic/react';
import './profile.css';
import EditPost from './editPost'

import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

// Internationalization
import { Trans } from '@lingui/macro';
import { withI18n } from "@lingui/react"

const PostPreview = ({ url, post }) => (
  <Link to={url}
    key={post.id}
    className={"photo-grid__photo" + (post.products.length!==0 ? " published" : "")}
    style={{ backgroundImage: `linear-gradient(white, white), url('${ post.media_url }')` }}
  ></Link>
)

const Profile = ({ i18n, hasAffiliateSetup, history, userInformation, username, posts, updatePost}) => {
  // If there's a post id defined in the url, open that post
  const { postId } = useParams();
  const openedPost = posts.map( post => post.id ).indexOf( postId );

  const hasProAccount = false;
  const daysTillTrialIsOver = 10 - Math.floor((new Date() - new Date( userInformation.createDate )) / ( 1000 * 60 * 60 * 24 ) )
  const noPublishedPosts = posts.filter( post => post.products.length > 0 ).length === 0;

  let upgradeWarning = {};
  if ( !hasProAccount ) {
    if ( daysTillTrialIsOver > -1 ) {
      upgradeWarning.message = i18n._("Your trial account expires in {daysTillTrialIsOver} days", {daysTillTrialIsOver})
      upgradeWarning.color = "warning";
    } else {
      upgradeWarning.message = i18n._("Upgrade your account to keep using Muah.bio")
      upgradeWarning.color = "danger"
    }
  }

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle><Trans>Profile</Trans></IonTitle>
          <IonButtons slot="end">
              <IonButton href={"https://muah.bio/"+username} target="_blank">
                <IonLabel><Trans>View Your Page</Trans></IonLabel>
              </IonButton>
            </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large"><Trans>Profile</Trans></IonTitle>
          </IonToolbar>
        </IonHeader>
        { noPublishedPosts || !hasAffiliateSetup ?
          <div className="disclaimer" style={{marginBottom: 0}}>
            {noPublishedPosts && <p><Trans>Welcome to Muah.bio! Greyed out posts have no products associated with them and will not show up on your page. Click on a post to add products.</Trans></p>}
            {!hasAffiliateSetup && <p><Trans>Remember to <b>connect your affiliate accounts</b> in settings to add products!</Trans></p>}
          </div>
        : null }
        { upgradeWarning.message &&
          <div className="trial-warning">
            <IonChip color={upgradeWarning.color}>{upgradeWarning.message}</IonChip>
          </div>
        }
        <IonGrid style={{maxWidth: 1000}}>
          <IonRow>
            {posts.map((post, index) => (
              <IonCol size="4" key={index}>
                <PostPreview url={`/${i18n._("profile")}/${post.id}`} post={post} />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
        { openedPost !== -1 ? <IonModal isOpen={openedPost !== -1} onDidDismiss={() => history.push('/'+i18n._("profile")+'/')}>
          <EditPost
            userInformation={userInformation}
            post={posts[openedPost]}
            updatePost={updatePost}
            closePost={() => history.push('/'+i18n._("profile")+'/')} />
        </IonModal> : null}
      </IonContent>
    </>
  );
}
export default withI18n()(Profile);
