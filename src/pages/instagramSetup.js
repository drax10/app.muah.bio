import React, { useState } from 'react';
import clientSideGetIGInfo from '../api/clientSideGetIGInfo';

import initializeUser from '../api/initializeUser';

import {
    IonPage,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonGrid,
    IonRow,
    IonItem,
    IonInput,
    IonLoading
} from '@ionic/react';

// Internationalization
import { Trans } from '@lingui/macro';
import { withI18n } from "@lingui/react"

import './loginScreen.css';

const InstagramSetup = ({ i18n, setUserInformation }) => {
    const [ instagramTag, setInstagramTag ] = useState('');
    const [ tagError, setTagError ] = useState('');
    const [ isLoading, setIsLoading ] = useState(false);

    const handleSetup = async e => {
        e.preventDefault();

        let cleanedInstagramTag = instagramTag.trim().toLowerCase().replace(/[^a-z0-9._]/g, '');
        if ( cleanedInstagramTag.length < 3 ) {
            setTagError( i18n._("{username} is not a valid instagram username", {username: cleanedInstagramTag}) );
        }

        setIsLoading( true );
        // Get the posts, if there is none, throw an error
        try {
            let { posts, followers } = await clientSideGetIGInfo( cleanedInstagramTag );
            
            // Add empty product array to each post
            posts = posts.map( post => ({...post, products: [] }) );

            // First load uses these while we upload the other posts.
            const uncachedPosts = JSON.parse(JSON.stringify(posts));

            // Cache all of the images
            for (let i = 0; i < posts.length; i++) {
                const post = posts[i];
                
                // Upload asyncronously
                fetch(`/.netlify/functions/cache-ig-photo?username=${instagramTag}&postId=${post.id}&url=${encodeURIComponent(post.media_url)}`)
                    // .then( response => response.text() )
                    .then( () => console.log(`Cached photo ${i+1} of ${posts.length}`));
                
                const newMediaUrl = "https://muah.b-cdn.net/"+instagramTag+"/"+post.id+".jpeg";
                post.media_url = newMediaUrl;
            }
            
            function initialize( message ){
                console.count("Initializing user...")
                console.log(message)
                initializeUser({ posts, ig_username: instagramTag, followers }).then( userInformation => {
                    userInformation.posts = uncachedPosts;
                    setUserInformation( userInformation );
                } ).catch(initialize);
            }
            initialize();
        } catch (error) {
            console.error( error )
            setTagError( i18n._("Instagram account doesnt exist or you are on a computer blocked by Instagram") );
            setIsLoading( false );
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle><Trans>One more thing</Trans></IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonGrid fixed>
                    <IonRow>
                        <form className="login-form" onSubmit={handleSetup}>
                            <h2><Trans>Connect your instagram account to start tagging your posts</Trans></h2>
                            <IonItem>
                                {/* <IonLabel position="stacked"><Trans>Email Address</Trans></IonLabel> */}
                                <IonInput
                                    type="text"
                                    placeholder={i18n._("Your Instagram Username")}
                                    value={instagramTag}
                                    onIonChange={e => setInstagramTag( e.target.value )}
                                />
                            </IonItem>
                            { tagError ? <p style={{color: "red"}}>{tagError}</p> : null }
                            <br />
                            <IonButton expand="full" size="large" type="submit"><Trans>Connect</Trans></IonButton>
                        </form>
                    </IonRow>
                </IonGrid>
                <IonLoading
                    isOpen={isLoading}
                    onDidDismiss={() => setIsLoading(false)}
                    message={i18n._("Creating your account")}
                    // duration={20000}
                />
            </IonContent>
        </IonPage>
    );
}

export default withI18n()(InstagramSetup);