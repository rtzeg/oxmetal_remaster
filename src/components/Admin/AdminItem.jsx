import React from 'react';
import styles from './Admin.module.scss';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function AdminItem({ arr, idx, arr2 }) {
  const { material, view, Guarantee, price, color, tipes, coating, sizes, key, category, profile } = arr;
  const navigate = useNavigate();
  const onDelete = async (key) => {
    try {
      if (confirm('вы действительно хотите удалить этот материал?'))
        await axios.delete(
          `https://oxmetal-49832-default-rtdb.asia-southeast1.firebasedatabase.app/Products/${key}.json`,
        );
      location.reload();
    } catch (err) {
      console.log(err);
      alert('Ошибка');
    }
  };

  return (
    <div className={styles.adminItem}>
      <img className="ProductImgW" src={color[0].src} />

      <h1 onClick={() => console.log(arr2)} className=" hover:underline hover:text-[#C5E500]">
        {material} {tipes} ({coating}-
        <span>
          {
            color[idx == undefined || idx == -1 ? Math.floor(Math.random() * color.length) : idx]
              .name
          }
        </span>
        -{sizes})
      </h1>

      <p>
        Материал: <span>{material}</span>
      </p>
      <p>
        Вид: <span>{view}</span>
      </p>
      <p>
        Гарантия: <span>{Guarantee} лет</span>
      </p>
      <p>
        Цена:
        <span className="BoldPrice ml-1">
          {price === 0 ? 'Цена по запросу' : price.toLocaleString('ru-RU')} сум/м<sup>2</sup>
        </span>
      </p>
      {category && (
        <p>
          Категория: <span>{category}</span>
        </p>
      )}
      {profile && (
        <p>
          Профиль: <span>{profile}</span>
        </p>
      )}

      <div className={`${styles.adminItemActions} flex items-center justify-between`}>
        <Link to={`/admin/control/add-item/${key}/${arr2}`}>
          <button className="flex py-[10px] mr-[15px] w-fit text-[11px] font-bold button px-[30px]">
            ИЗМЕНИТЬ
          </button>
        </Link>

        <button
          onClick={() => onDelete(arr2)}
          className="flex items-center py-[10px] w-fit text-[11px] font-bold button px-[30px]">
          УДАЛИТЬ <img className="w-[15px] h-[15px]" src="../icons/close.png" alt="close" />
        </button>
      </div>
    </div>
  );
}
