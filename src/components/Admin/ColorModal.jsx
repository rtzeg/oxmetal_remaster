import React from 'react';
import styles from './Admin.module.scss';


import { ref, set, push, update } from 'firebase/database';
import { db } from '../../../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { fetchColors } from '../../features/colorsSlice';

export default function ColorModal({ addNewColorModal, setAddNewColorModal, colors }) {
  // const dispatch = useDispatch();
  // const colors = useSelector((state) => state.colors.colors);
 const  [render, setRender] = React.useState(false) // Создаем переменную состояния

  // Функция, которая будет вызываться, чтобы перерендерить компонент
  const forceUpdate = () => updateState({});

  const [newColor, setNewColor] = React.useState({
    RGBA: '',
    color: '#0000',
    name: '',
  });

  const onAddNewColor = async () => {
    // e.preventDefault();
    console.log(newColor);
    const filtredColor = colors.find((col) => col.RGBA === newColor.RGBA);
    console.log(filtredColor);
    if (filtredColor !== undefined) {
      alert('Такой цвет уже есть, добавьте другой цввет');
    } else {
      const newDocRef = ref(db, 'Colors');

      try {
        await push(newDocRef, newColor);
        alert('Новый цвет добавлен');
        setAddNewColorModal(false);
        window.location.reload()

        // navigate('/admin/control');
      } catch (err) {
        console.log(err);
        alert('Ошибка при добавление');
      }
    }
  };
  // React.useEffect(()=>{
  //   setRender(true)
  // },[colors])


  return (
    <div className={`${styles.colorModal} ${addNewColorModal ? 'block' : 'hidden'}`}>
      <div className={styles.addNewColorModalWrapper}>
        <label className="opacity-60 text-[20px]" htmlFor="">
          Цвет в RGB
        </label>
        <input
          className="border-b p-4 text-[18px] outline-none"
          type="text"
          placeholder="укажите цвет в RGB"
          onChange={(e) => setNewColor((prev) => ({ ...prev, RGBA: e.target.value }))}
          value={newColor.RGBA}
        />
        <label className="mt-4 opacity-60 text-[20px]" htmlFor="">
          Цвет
        </label>

        <div className="flex items-center justify-between">
          <input
            className="border-b p-4 text-[18px] outline-none"
            type="text"
            placeholder="укажите цвет"
            onChange={(e) => setNewColor((prev) => ({ ...prev, color: e.target.value }))}
            value={newColor.color}
          />
          {/* <div
              style={{
                width: '50px',
                height: '50px',
                border: '1px solid black',
                borderRadius: '11px',
              }}></div> */}
          <input
            className={`w-[50px] h-[50px] outline-none ${
              newColor.color === '' ? 'opacity-[10%]' : 'opacity-[100%]'
            }`}
            type="color"
            value={newColor.color}
          />
        </div>

        <label className="mt-4 opacity-60 text-[20px]" htmlFor="">
          Название нового цвета
        </label>
        <input
          className="border-b p-4 text-[18px] outline-none"
          type="text"
          placeholder="укажите название цвета"
          onChange={(e) => setNewColor((prev) => ({ ...prev, name: e.target.value }))}
          value={newColor.name}
        />
        <div className="flex justify-between">
          <div className="flex items-center mt-8 py-2">
            <div className="button w-[170px] h-[70px] flex items-center justify-center">
              <button onClick={onAddNewColor}>Добавить</button>
            </div>
          </div>
          <div className="flex items-center mt-8 py-2">
            <div className="button w-[170px] h-[70px] flex items-center justify-center">
              <button onClick={() => setAddNewColorModal(false)}>Отмена</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
