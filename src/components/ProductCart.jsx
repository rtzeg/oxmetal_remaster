/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from '../contexts/Modal';

const ProductCart = ({ Product, idx }) => {
  // eslint-disable-next-line react/prop-types
  const { setOpenModal } = useContext(Modal);
  
  const { material, view, Guarantee, price, color, tipes, coating, sizes, key } = Product;


  return (
    <div
      className="Goods_item "
      data-aos="fade-up"
      data-aos-duration="700"
      data-aos-anchor-placement="bottom-bottom">
     
      <Link to={'/product/' + key}>
        <img
          className="ProductImgW"
          src={
            color[idx == undefined || idx == -1 ? Math.floor(Math.random() * color.length) : idx]
              .src
          }
        />
      </Link>
      <Link to={'/product/' + key}>
        <h1 className=" hover:underline hover:text-[#C5E500]">
          {material} {tipes} ({coating}-
          <span>
            {
              color[idx == undefined || idx == -1 ? Math.floor(Math.random() * color.length) : idx]
                .name
            }
          </span>
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
        <Link to={'/product/' + key}>
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
