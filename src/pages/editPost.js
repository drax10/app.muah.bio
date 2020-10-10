import React, { useEffect, useState } from 'react';
import ProductSearch from './productSearch';

import './editPost.css';

// import Header from '../components/header';
// import {arrayMove, SortableContainer, SortableElement, sortableHandle} from 'react-sortable-hoc';
// import swal from 'sweetalert';
// import ProductSearchBar from '../components/productSearchBar';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonModal,
  IonPage,
  IonReorder,
  IonReorderGroup,
  IonSearchbar,
  IonThumbnail,
  IonToolbar,
} from '@ionic/react';
import { closeCircle } from 'ionicons/icons';

function doReorder(event) {
  // The `from` and `to` properties contain the index of the item
  // when the drag started and ended, respectively
  console.log('Dragged from index', event.detail.from, 'to', event.detail.to);

  // Finish the reorder and position the item in the DOM based on
  // where the gesture ended. This method can also be called directly
  // by the reorder group
  event.detail.complete();
}

const SwipeableProduct = ({ product, index, removeProduct }) => (
  <IonItemSliding key={ product.url } onIonSwipe={()=>removeProduct(index)}>
    <IonItemOptions side="start">
      <IonItemOption color="danger" expandable onClick={()=>removeProduct(index)}>
        Delete
      </IonItemOption>
    </IonItemOptions>

    <IonItem>
      <IonThumbnail slot="start"  style={{background: "#ffffff", borderRadius: 4}}>
        <img src={product.image} alt="" style={{objectFit: "contain"}} />
      </IonThumbnail>
      <IonLabel className="ion-text-wrap">
        <h3>{product.name}</h3>
        <p>{ product.retailer.name }{ product.price.number ? " | "+product.price.symbol: ""}{ product.price.number }</p>
      </IonLabel>
      <IonReorder slot="end" />
    </IonItem>
  </IonItemSliding>
)

function EditPost({ post, updatePost, closePost } ){
  const [ productSearchIsOpen, setProductSearchIsOpen ] = useState( false );
  const [ products, setProducts ] = useState( post.products );

  useEffect(() => {
    setProducts(post.products)
  }, [post]);

  useEffect(() => {
    document.querySelector("ion-tab-bar").style.display = "none";
    // TODO: Make this smoother
    return () => document.querySelector("ion-tab-bar").style.display = "flex";
  })

    // const [ showSearchBar, setShowSearchBar ] = useState(false);

    function addProduct( product ) {
        setProductsInDb( products => products.concat( product ) )
    }

    async function removeProduct( productIndex ) {
      console.log( 'removing product' )
      setProductsInDb( post.products.filter( (x,index) => index!==productIndex ) )
    }

    // function onSortEnd({oldIndex, newIndex}){
    //     setProducts( products => arrayMove( products, oldIndex, newIndex ) );
    // }

    function setProductsInDb( products ){
        setProducts( products )
        let postCopy = { ...post };
        if ( typeof products === "function" ) {
            updatePost( post.id, {
                ...post,
                products: products(postCopy.products)
            });
        } else {
            updatePost( post.id, {
                ...post, products
            });
        }
    }

    // function togglePublished(){
    //     if ( !post.isPublished ) {
    //         history.push('/');
    //     }
    //     updatePost( post.id, {
    //         ...post,
    //         isPublished: !post.isPublished
    //     });
    // }

    function openProductSearch(e) {
      setProductSearchIsOpen(true);
      // const focusOnInput = () => {
      //   const searchBar = document.querySelector(".product-search-bar");
      //   console.log(searchBar)
      //   if ( !searchBar ) {
      //     console.log("try again")
      //     return setTimeout( focusOnInput, 10 );
      //   }
      //   searchBar.setFocus();
      // }
      // const inputElement = document.querySelector(".product-search-bar input");

      // setTimeout(()=>{
      //   const inputElement = document.querySelector(".product-search-bar input");
      //   inputElement.click();
      //   inputElement.focus();
      //   // inputElement.setAttribute("autofocus", true)
      // }, 1000)
    }
    console.log( post )

    return (
      <IonPage>
        <IonContent fullscreen>
          <div className=".header-buttons">
            <IonButtons slot="end" className="header-buttons">
              <IonButton onClick={closePost}>
                <IonIcon icon={closeCircle} size="large" />
              </IonButton>
            </IonButtons>
          </div>
          <div className="edit-post-header" style={{ backgroundImage: `url(${post.media_url})` }}></div>
          <IonReorderGroup disabled={false} onIonItemReorder={doReorder}>
          {products.map((product, i) => (
            <SwipeableProduct product={product} index={i} removeProduct={removeProduct} key={i} />
          ))}
          </IonReorderGroup>
        </IonContent>

        <IonModal
          isOpen={productSearchIsOpen}
          onDidDismiss={() => setProductSearchIsOpen(false)}
          swipeToClose={true} >
            <ProductSearch closeSearch={() => setProductSearchIsOpen(false)} addProduct={addProduct} />
        </IonModal>

        <IonFooter className="ion-no-border" onTouchStart={ openProductSearch }>
          <IonToolbar>
            <IonSearchbar
              placeholder="Search for makeup products"
              style={{pointerEvents: "none"}}
            ></IonSearchbar>
          </IonToolbar>
        </IonFooter>
      </IonPage>
    )

    // // TODO: Design what the screen looks like when empty
    // return (
    //     <div>
    //     {/* <Header
    //         backIcon={<KeyboardArrowLeftRoundedIcon />}
    //         backText="Profile"
    //         backAction={ () => history.push('/') }
    //         title="Edit Post"
    //         key="header"
    //         forwardText={ post.isPublished ? "unpublish" : "publish" }
    //         forwardAction={ togglePublished }
    //         forwardDisabled={ post.products.length === 0 }
    //         forwardStyle={{ color: post.isPublished ? "red" : "blue" }}/> */}
    //     <div className="page edit-post">
    //         <div className="edit-page-image" style={{ backgroundImage: `url(${post.media_url})` }}></div>
    //         <div className="edit-page-products">
    //             <SortableProductList 
    //                 useDragHandle={true}
    //                 products={ post.products }
    //                 removeProduct={ removeProduct }
    //             />
    //             <br />
    //             <div className={post.products.length === 0 ? "" : "stick-to-bottom animate-with-parent" }>
    //                 <button className="full-width" onClick={ ()=>setShowSearchBar(true) }>Add Product</button>
    //                 { post.products.length === 0 ? 
    //                     <a href="#" style={{display: "block", padding: 20, textAlign: "center"}}>or link this post to a website</a>
    //                     : null
    //                 }
    //             </div>
    //             <div></div>
    //             { showSearchBar ?
    //                 <ProductSearchBar
    //                     exitSearch={()=>setShowSearchBar(false)}
    //                     addProduct={addProduct}
    //                 /> : null
    //             }
    //         </div>
    //     </div>
    //     </div>
    // )
}

export default EditPost;