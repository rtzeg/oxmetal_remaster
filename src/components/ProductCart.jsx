/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from '../contexts/Modal';

const ProductCart = ({ Product, idx }) => {
  // eslint-disable-next-line react/prop-types
  const { setOpenModal } = useContext(Modal);
  
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
    blueprint,
    viewImg,
    materialImg,
  } = Product;
  const productId = id ?? key;
  const colorList = Array.isArray(color) ? color : [];
  const fallbackImage = blueprint || viewImg || materialImg;
  const colorIndex =
    idx == undefined || idx == -1 ? Math.floor(Math.random() * colorList.length) : idx;
  const selectedColor = colorList[colorIndex];
  const productImage = selectedColor?.src || fallbackImage;


  return (
    <div
      className="Goods_item "
      data-aos="fade-up"
      data-aos-duration="700"
      data-aos-anchor-placement="bottom-bottom">
     
      <Link to={'/product/' + productId}>
        {productImage && <img className="ProductImgW" src={productImage} />}
      </Link>
      <Link to={'/product/' + productId}>
        <h1 className=" hover:underline hover:text-[#C5E500]">
          {material} {tipes} ({coating}-
          <span>{selectedColor?.name || 'цвет'}</span>
          -{sizes})
        </h1>
      </Link>
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
      <div className="Optins">
        <Link to={'/product/' + productId}>
          <button className="flex py-[10px] w-fit text-[11px] font-bold button px-[30px]">
            ПОДРОБНЕЕ
          </button>
        </Link>
        <img
          onClick={() => {
            setOpenModal(true);
          }}
          src="./phone.svg"
          className=" w-[32px]"
        />
      </div>
    </div>
  );
};

export default ProductCart;
