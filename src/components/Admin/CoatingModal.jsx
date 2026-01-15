import React from 'react';
import styles from './Admin.module.scss';
import { apiClient } from '../../utils/api';

export default function CoatingModal({ arr, isCoatingModal, setIsCoatingModal }) {
  const [newCoating, setNewCoating] = React.useState('');
  console.log(arr);
  const onAddNewCoating = async (e) => {
    e.preventDefault();

    const isIncludeCoat = arr.find((coat) => coat === newCoating);

    if (isIncludeCoat !== undefined) {
      alert('Такое покрытие уже есть');
    } else {
      try {
        await apiClient.post('/coatings', { name: newCoating });
        alert('Новое покрытие добавлено');

        window.location.reload();

        // navigate('/admin/control');
      } catch (err) {
        console.log(err);
        alert('Ошибка при добавление');
      }
    }
  };

  return (
    <div className={`${styles.coatingModal} ${isCoatingModal ? 'block' : 'hidden'}`}>
      <div className={styles.coatingWrapper}>
        <input
          className="border-b p-4 text-[18px] outline-none"
          type="text"
          placeholder="Добавьте новое покрытие"
          value={newCoating}
          required
          onChange={(e) => setNewCoating(e.target.value)}
        />
        <div className="flex justify-between">
          <div className="flex items-center mt-8 py-2">
            <div className="button w-[170px] h-[70px] flex items-center justify-center">
              <button onClick={onAddNewCoating}>Добавить</button>
            </div>
          </div>
          <div className="flex items-center mt-8 py-2">
            <div className="button w-[170px] h-[70px] flex items-center justify-center">
              <button onClick={() => setIsCoatingModal(false)}>Отмена</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
