import React from 'react';
import styles from './Admin.module.scss';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../../utils/api';

export default function AdminItem({ arr, idx }) {
  const {
    id,
    material,
    view,
    Guarantee,
    price,
    color,
    tipes,
    coating,
    sizes,
    key,
    category,
    profile,
    blueprint,
    viewImg,
    materialImg,
  } = arr;
  const navigate = useNavigate();
  const colorList = Array.isArray(color) ? color : [];
  const fallbackImage = blueprint || viewImg || materialImg;
  const colorIndex =
    idx == undefined || idx == -1 ? Math.floor(Math.random() * colorList.length) : idx;
  const selectedColor = colorList[colorIndex];
  const productImage = selectedColor?.src || fallbackImage;
  const onDelete = async (key) => {
    try {
      if (confirm('вы действительно хотите удалить этот материал?'))
        await apiClient.delete(`/products/${key}`);
      location.reload();
    } catch (err) {
      console.log(err);
      alert('Ошибка');
    }
  };

  return (
    <div className={styles.adminItem}>
      {productImage && <img className="ProductImgW" src={productImage} />}

      <h1 className=" hover:underline hover:text-[#C5E500]">
        {material} {tipes} ({coating}-
        <span>{selectedColor?.name || 'цвет'}</span>
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
        <Link to={`/admin/control/add-item/${id ?? key}`}>
          <button className="flex py-[10px] mr-[15px] w-fit text-[11px] font-bold button px-[30px]">
            ИЗМЕНИТЬ
          </button>
        </Link>

        <button
          onClick={() => onDelete(id ?? key)}
          className="flex items-center py-[10px] w-fit text-[11px] font-bold button px-[30px]">
          УДАЛИТЬ <img className="w-[15px] h-[15px]" src="../icons/close.png" alt="close" />
        </button>
      </div>
    </div>
  );
}
