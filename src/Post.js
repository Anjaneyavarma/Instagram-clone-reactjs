import React, {useState, useEffect} from 'react'
import Avatar from '@material-ui/core/Avatar';
import './Post.css';
import { Button } from '@material-ui/core';
import { db } from './firebase';
import firebase from 'firebase';

function Post({postId, user, username, ImageUrl, caption}) {

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if(postId){
            unsubscribe = db
            .collection('posts')
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp', 'asc')
            .onSnapshot((onsnapshot)=>{
                setComments(onsnapshot.docs.map((doc)=> doc.data()))
            })
        }
        return () => {
            unsubscribe();
        }
        
    }, [postId])

    const postComment =(event) =>{
        event.preventDefault();
        db
        .collection('posts')
        .doc(postId)
        .collection('comments').add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })

        setComment('');
    }

    return (
        <div className='post'>
            {/* Post Header= Avatar+username*/}
            <div className='post_header'>
            <Avatar 
                className='post_avatar'
                alt="Remy Sharp" 
                src="/static/images/avatar/1.jpg"
            />
            <h5>{username}</h5>
            </div>
            {/* Post Image*/}
            <img className='post_image'
            src={ImageUrl}
            alt='post1'/>
            {/* Post username+caption*/}
            <h5 className='post_caption'><strong>{username}:</strong> {caption}</h5>

            <div className='app_comments'>
                {comments.map((comment) => (
                    <p>
                        <b>{comment.username}:</b> {comment.text}
                    </p>
                ))}
            </div>
            {user && (
                <form className='post_CommentBox'>
                <input className='post_input'
                type='text'
                placeholder='Add a comment....'
                value={comment}
                onChange ={(e)=>setComment(e.target.value)}
                />
                <button className='post_comment' type='submit' disabled={!comment} onClick={postComment} >Post</button>
            </form>
            )}
            


        </div>
    )
}

export default Post
