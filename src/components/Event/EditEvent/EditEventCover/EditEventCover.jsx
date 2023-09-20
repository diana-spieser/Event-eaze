import { useEffect, useState } from 'react';
import { FormControl } from '@chakra-ui/react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../../../config/firebase-config';
import PropTypes from 'prop-types';

function EditEventCover({ selectedImage, setSelectedImage, photoUrl }) {
  // eslint-disable-next-line no-unused-vars
  const [previewAvatar, setPreviewAvatar] = useState();

  useEffect(() => {
    if (!selectedImage) {
      return setPreviewAvatar(undefined);
    }
    setPreviewAvatar(selectedImage);
  }, [selectedImage]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const storageRef = ref(storage, 'eventsImages/' + file.name);
      const uploadTask = uploadBytes(storageRef, file);

      uploadTask
        .then((snapshot) => {
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            setSelectedImage(downloadURL);
          });
        })
        .catch((error) => {
          console.error('Error uploading image:', error);
        });

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <FormControl id='selectedImage' mt={ 4 }>
      <label className='custom-file-upload'>
        <input
          type='file'
          onChange={ handleFileChange }
          defaultValue={ selectedImage ? selectedImage.name : '' }
        />
        Upload Event Cover
      </label>
      {(selectedImage || photoUrl) && (
        <img
          src={ selectedImage ? selectedImage : photoUrl }
          alt='Selected Event Image'
          style={ { maxWidth: '100%', marginTop: '10px' } }
        />
      )}
    </FormControl>
  );
}

export default EditEventCover;

EditEventCover.propTypes = {
  selectedImage: PropTypes.any,
  setSelectedImage: PropTypes.func,
  photoUrl: PropTypes.string,
};
