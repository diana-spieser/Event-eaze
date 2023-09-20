import { useEffect, useState } from 'react';
import { FormControl } from '@chakra-ui/react';
import PropTypes from 'prop-types';

function UploadEventCover({ selectedImage, setSelectedImage }) {
  const [previewAvatar, setPreviewAvatar] = useState();
     
  useEffect(() => {
    if (!selectedImage) {
      return setPreviewAvatar(undefined);
    }
    const objectUrl = URL.createObjectURL(selectedImage);
    setPreviewAvatar(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);
     
  const handleFileChange = (e) => {
    const file = e.target.files[0];
  
    if (file) {
      setSelectedImage(file);
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
      {selectedImage && (
        <img
          src={ previewAvatar }
          alt='Selected Event Image'
          style={ { maxWidth: '100%', marginTop: '10px' } }
        />
      )}
    </FormControl>    
  );
}
  
export default UploadEventCover;
  
UploadEventCover.propTypes = {
  selectedImage: PropTypes.any,
  setSelectedImage: PropTypes.func
};
  