import React, {useState}  from 'react';
import Modal from '@material-ui/core/Modal';
import { makeStyles} from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import './App.css'
import {db, auth, storage} from './firebase';
import firebase from 'firebase';

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




function ImageUpload({username}) {
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [openUpload, setOpenUpload] = useState(false);
    const [image, setImage] = useState(null)
    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState(0);

    const handleChange = (event) => {
        if(event.target.files[0]){
            setImage(event.target.files[0])
        }
    };

     const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
          "state_changed",
          ()=>{
            storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then(url =>{
              db.collection('posts').add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                caption: caption,
                ImageUrl: url,
                username: username
              });

              setProgress(0);
              setImage("");
              setCaption(null);

            })
            setOpenUpload(false);
          })
    }

    return (
        <div>
    <Modal
        open={openUpload}
        onClose={() => setOpenUpload(false)}   
      >
        <div style={modalStyle} className={classes.paper}>
        <form className='app_signup'>
            <center>
              <img  src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png' 
                    alt='instagram'/>
            </center>
            
              <Input
                type='file'
                onChange={handleChange}
              />
              <Input
                placeholder="Enter a caption"
                type='text'
                value={caption}
                onChange={(e)=> setCaption(e.target.value)}
              />
              
              <Button type='submit' onClick={handleUpload} color='primary' variant="contained">UPLOAD</Button>
            </form>
        </div>
      </Modal>
      <Button type="submit" onClick={() => setOpenUpload(true)} color='secondary' variant="contained">UPLOAD</Button>


      {/*<progress value={progress} max="100"/>
      <input type="test" placeholder="enter caption" onChange={(event)=> setCaption(event.target.value)}/>
      <input type="file" onChange={handleChange}/>
    <Button type="submit" onClick={handleUpload} color='primary' variant="contained">UPLOAD</Button>*/}
        </div>
    )
}

export default ImageUpload
