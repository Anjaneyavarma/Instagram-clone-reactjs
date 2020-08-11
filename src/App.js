import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import Post from './Post';
import {db, auth} from './firebase';
import Modal from '@material-ui/core/Modal';
import { makeStyles} from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import { findByLabelText } from '@testing-library/react';


function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));




function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [openSinIn, setOpenSignIn] = useState(false);
  

  const signUp = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser)=>{
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message));
    setOpen(false);
  }

  useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        console.log(authUser);
        setUser(authUser);
        
      }else{
        setUser(null);
      }
    })
    return () => {
      unsubscribe();
    };
  }, [user, username]);

  const singIn = (event) =>{
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
    .catch((error)=> alert(error.message))
    setOpenSignIn(false);
  }


  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
        setPosts(snapshot.docs.map(doc => ({ 
          id: doc.id,
          post: doc.data()
        })));
    })
  }, [])

  return (
    <div className="App">
      
      <Modal
        open={open}
        onClose={() => setOpen(false)}   
      >
        <div style={modalStyle} className={classes.paper}>
        <form className='app_signup'>
            <center>
              <img  src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png' 
                    alt='instagram'/>
            </center>
            <Input
                placeholder="Username"
                type='text'
                value={username}
                onChange={(e)=> setUsername(e.target.value)}
              />
              <Input
                placeholder="Email"
                type='email'
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type='password'
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signUp} color='primary' variant="contained">SIGN UP</Button>
            </form>
        </div>
      </Modal>

      <Modal
        open={openSinIn}
        onClose={() => setOpenSignIn(false)}   
      >
        <div style={modalStyle} className={classes.paper}>
        <form className='app_signup'>
            <center>
              <img  src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png' 
                    alt='instagram'/>
            </center>
              <Input
                placeholder="Email"
                type='email'
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type='password'
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
              />
              
              <Button type="submit" onClick={singIn} color='primary' variant="contained">SIGN IN</Button>
            </form>
        </div>
      </Modal>
      
      {/* Header */}
      <div className='app_header'>
          <img className='app_headerImage' src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png' 
          alt='instagram'/>

      {/*Signin - signup */}
      {user?.displayName?
      ( 
      <div className='app_loadAuth'>
        <ImageUpload username = {user.displayName}/>
        <Button onClick={()=>auth.signOut()} color='primary' variant="contained">LOGOUT</Button>
      </div>
      ):(
      <div className='app_laodAuth'>
       <Button onClick={()=>setOpenSignIn(true)} color='primary' variant="contained">Sign In</Button>
      <Button onClick={()=>setOpen(true)} color='primary' variant="contained">Sign Up</Button>
      </div>
      )}


      </div>


      
      
     
      {/* Posts*/}      
      {posts.map(({id,post}) => (
        <Post key = {id}
              postId = {id}
              user = {user}
              username={post.username} 
              ImageUrl={post.ImageUrl}
              caption={post.caption}/>
      ))}
      
      {/*<Post Username='god_of_thunder' caption='hello world' ImageUrl='https://instagram.fvga2-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/p640x640/117111236_115952143355220_759487305154062259_n.jpg?_nc_ht=instagram.fvga2-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=KeSVqJ4VUgEAX-7sAyI&oh=fe9d8f19d99d2d6695e888af039cbfbe&oe=5F53AA28'/>
      <Post Username='pickachu' caption='hello world' ImageUrl='https://instagram.fvga2-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/p640x640/117169220_3012580658854646_3249332334940467888_n.jpg?_nc_ht=instagram.fvga2-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=HIE3gEYV7LsAX9LiKTF&oh=bbe2dee55f945239ac50213d92c6c4d1&oe=5F523493'/>
      <Post Username='wolfie' caption='hello world' ImageUrl='https://instagram.fvga2-1.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/p640x640/117111236_115952143355220_759487305154062259_n.jpg?_nc_ht=instagram.fvga2-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=KeSVqJ4VUgEAX-7sAyI&oh=fe9d8f19d99d2d6695e888af039cbfbe&oe=5F53AA28'/>*/}
    </div>
  );
}

export default App;
