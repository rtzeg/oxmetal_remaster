import React, { useRef } from 'react';
import styles from './Admin.module.scss';
import { storage } from '../../../firebase';
import { getDownloadURL, ref as sRef, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';

export default function AdminColors({
  arr,
  addSelectColor,
  activeColor,
  setActiveColor,
  colorModal,
  setColorModal,
  setAddNewColorModal,
}) {
  const [modalPhoto, setModalPhoto] = React.useState('');
  const [data, setData] = React.useState({
    RGBA: '',
    color: '',
    name: '',
    src: '',
  });

  const imgRef = useRef(null);
  const openPhoto = (e) => {
    e.preventDefault();
    imgRef.current.click();
  };

  const handleColor = (RGBA, color, name) => {
    setData((prev) => ({
      ...prev,
      RGBA: RGBA,
      color: color,
      name: name,
    }));
  };

  const clearInput = () => {
    setModalPhoto('');
    
  };

  const handleChangeFile = (e) => {
    const file = e.target.files[0];

    if (!file) {
      console.error('Файл не выбран');
    }

    const imgRef = sRef(storage, `profImg/${v4()}`);

    // Загружаем файл в хранилище
    uploadBytes(imgRef, file)
      .then((snapshot) => {
        console.log('Файл успешно загружен', snapshot);
        getDownloadURL(snapshot.ref).then((val) => {
          setData((prevData) => ({
            ...prevData,
            src: val,
          }));
          setModalPhoto(val);
        });
      })
      .catch((error) => {
        console.error('Ошибка при загрузке файла', error);
      });
  };
  // React.useEffect(() => {
  //   console.log('fdsa');
  // }, [arr.length]);

  return (
    <div className={`${styles.adminModal} ${colorModal ? 'block' : 'hidden'}`}>
      <div className={styles.adminWrapper}>
        <div
          onClick={() => setColorModal(false)}
          className="flex w-[40px] h-[40px]  absolute top-2 right-4 items-center justify-center mt-4">
          <img className="hover:cursor-pointer" src="/close.png" alt="close" />
        </div>

        <div className="flex">
          <div className="button w-[170px] h-[70px] flex items-center justify-center">
            <button onClick={openPhoto}>Добавить фото</button>
          </div>
          {modalPhoto && <img className="w-[250px] h-[120px] ml-4" src={modalPhoto} alt="фото" />}
          <input required ref={imgRef} onChange={(e) => handleChangeFile(e)} type="file" hidden />
        </div>
        <h2 className="mt-[25px]">Выберите цвет</h2>
        <div className="flex gap-2 flex-wrap items-center h-[500px] py-2 pb-2 px overflow-y-scroll">
          {arr?.map((col, idx) => (
            <div
              onClick={() => {
                handleColor(col.RGBA, col.color, col.name, idx);
              }}
              className="flex flex-col mt-2"
              key={idx}>
                <div className='overflow-hidden'>
                   <p className="text-center text-[14px]">{col.name}</p> 
                </div>
            
              <div
                onClick={() => setActiveColor(idx)}
                className={activeColor === idx ? styles['active-color'] : ''}
                style={{
                  width: '120px',
                  height: '60px',
                  borderRadius: '8px',
                  backgroundColor: col.color,
                  gap: '25px',
                  cursor: 'pointer',
                  boxShadow: '0px 1px 5px',
                }}></div>
            </div>
          ))}
          <div className="flex mt-8 ml-1 items-center justify-center">
            <div
              onClick={() => setAddNewColorModal(true)}
              className="w-[50px] flex  text-[20px] font-bold bg-[#c5e500] cursor-pointer items-center justify-center h-[50px] border rounded-[50%]">
              +
            </div>
          </div>
        </div>

        <div
          onClick={clearInput}
          className="button mt-4 w-[150px] h-[70px] flex items-center justify-center">
          <button
            onClick={() => {
              addSelectColor(data);
            }}>
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
}
