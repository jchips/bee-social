import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ProgressBar, Toast, Button } from 'react-bootstrap';
import AddImageModal from './PostModals/AddImageModal';
import { useAuth } from '../../contexts/AuthContext';
import { db, storage, ref, uploadBytesResumable, getDownloadURL } from '../../firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { v4 as uuidV4 } from 'uuid';

const AddImageButton = ({ setError }) => {
  const { currentUser } = useAuth();
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [showImgModal, setShowImgModal] = useState(false);

  /**
   * Adds a text post to the Firestore database.
   * @param {String} title - The title of the post being uploaded
   * @param {String} caption - The caption of the post being uploaded
   */
  const addTextPost = async (title, caption) => {
    try {
      await addDoc(collection(db, 'files'), {
        userID: currentUser.uid,
        title,
        caption,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error(err);
      setError('Could not add post');
    }
  }

  /**
   * Uploads either a post with an image and text or a post with just text to the Firebase database and storage.
   * @param {File} file - An image file to upload
   * @param {String} title - The title of the post being uploaded
   * @param {String} caption - The caption of the post being uploaded
   * @returns - If the file is not a jpg, then just exit the function
   */
  const handleUpload = (file, title, caption) => {
    if (!file) {
      addTextPost(title, caption);
    } else {
      if (file.type !== 'image/jpeg') return;

      // allows us to create unique ids
      const id = uuidV4();
      setUploadingFiles(prevUploadingFiles => [
        ...prevUploadingFiles,
        { id: id, name: file.name, progress: 0, error: false }
      ]);

      const storageRef = ref(storage, `/files/${currentUser.uid}/${file.name}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      // snapshot runs all the time and tell progress of our upload
      uploadTask.on('state_changed', snapshot => {
        const progress = snapshot.bytesTransferred / snapshot.totalBytes;
        setUploadingFiles(prevUploadingFiles => {
          return prevUploadingFiles.map(uploadFile => {
            if (uploadFile.id === id) {
              return { ...uploadFile, progress: progress }
            }
            return uploadFile;
          })
        })
      }, () => {
        // If there's an error in the upload process, it will set the error to true
        setUploadingFiles(prevUploadingFiles => {
          return prevUploadingFiles.map(uploadFile => {
            if (uploadFile.id === id) {
              return { ...uploadFile, error: true }
            }
            return uploadFile;
          })
        })
      }, () => {
        // Removes progress bar once upload is finished
        setUploadingFiles(prevUploadingFiles => {
          return prevUploadingFiles.filter(uploadFile => {
            return uploadFile.id !== id
          });
        });

        // Gets the download url for the image file now that the image is uploaded
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            const q = query(
              collection(db, 'files'),
              where('name', '==', file.name),
              where('userID', '==', currentUser.uid))

            // Adds image to Cloud Firestore
            getDocs(q)
              .then(async (existingFiles) => {
                const existingFile = existingFiles.docs[0];
                if (existingFile) {
                  const fileDocRef = doc(db, 'files', existingFile.id);
                  await updateDoc(fileDocRef, { url: downloadURL });
                } else {
                  try {
                    await addDoc(collection(db, 'files'), {
                      name: file.name,
                      url: downloadURL,
                      userID: currentUser.uid,
                      title,
                      caption,
                      createdAt: serverTimestamp()
                    });
                  } catch (err) {
                    console.error(err);
                    setError('Could not add post');
                  }
                }
              })
          });
      })
    }
  }
  return (
    <div className='add-image-btn'>
      <Button variant='dark' onClick={() => setShowImgModal(true)} className='mt-2 button button-background'>Add image</Button>
      <AddImageModal
        showImgModal={showImgModal}
        setShowImgModal={setShowImgModal}
        handleUpload={handleUpload}
      />
      {uploadingFiles.length > 0 && ReactDOM.createPortal(
        <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', maxWidth: '250px' }}>
          {uploadingFiles.map(file => (
            <Toast key={file.id} onClose={() => {
              // Close button will clear out errors.
              // If it doesn't equal the current file, then don't remove it
              setUploadingFiles(prevUploadingFiles => {
                return prevUploadingFiles.filter(uploadFile => {
                  return uploadFile.id !== file.id
                })
              })
            }}>
              <Toast.Header className='text-truncate w-100 d-block' closeButton={file.error}>{file.name}</Toast.Header>
              <Toast.Body>
                <ProgressBar
                  variant={file.error ? 'danger' : 'primary'}
                  animated={!file.error}
                  now={file.error ? 100 : file.progress * 100}
                  label={file.error ? 'Error' : `${Math.round(file.progress * 100)}%`} />
              </Toast.Body>
            </Toast>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}

export default AddImageButton;
