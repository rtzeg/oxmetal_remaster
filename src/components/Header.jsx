// eslint-disable-next-line no-unused-vars
import React, { useContext, useState } from 'react';
import { AiOutlineClose, AiOutlineMail, AiOutlineSearch, AiOutlineMenu } from 'react-icons/ai';
// import { AiOutlineMenu } from "react-icons/ai";
import { BsTelephone } from 'react-icons/bs';
import { FaMapMarkerAlt } from 'react-icons/fa';

import { Link } from 'react-router-dom';
import { Modal } from '../contexts/Modal';
const Header = () => {
  const [Burger, setBurger] = useState(false);
  const { setOpenModal } = useContext(Modal);
  return (
    <>
      <header className=" fixed top-0  w-full bg-white z-[9997] border-b-2 border-[#DBFF00] px-5">
        <nav className="mx-auto max-w-[1920px]  flex justify-between items-center  ">
          <ul className="justify-start flex gap-5 items-center  p-5 md:w-[100%] md:justify-between ">
            <li className="hidden sm:block"></li>
            <li className="flex">
              <Link to={'/'}>
                <img src="/logo.svg" alt="" />
              </Link>
              <Link to={'/search'}>
                <div className=" py-1 px-2 cursor-pointer w-fit bg-[#C5E500] ml-5  rounded-full flex items-center gap-3  sm:hidden ">
                  <AiOutlineSearch className="text-white text-[25px]" />
                  {/* <p>Поиск по товарам</p> */}
                  {/* <input
                type="text"
                className="outline-none"
                placeholder="Поиск по товарам"
              /> */}
                </div>
              </Link>
            </li>

            <li className="hidden md:block">
              {Burger ? (
                <AiOutlineClose
                  onClick={() => {
                    setBurger(!Burger);
                  }}
                  className="text-[#C5E500] text-[30px]"
                />
              ) : (
                <AiOutlineMenu
                  onClick={() => {
                    setBurger(!Burger);
                  }}
                  className="text-[#C5E500] text-[30px]"
                />
              )}
            </li>
          </ul>
          <ul className="flex items-center gap-5">
            {/* <Link to='/admin/control'>

            <li>Админка</li>
            </Link> */}
         
            <li className=" md:hidden text-[14px] leading-[14px] font-[500]">
              <Link to={'/catalog'} className=" hover:text-[#C5E500]">
                {' '}
                Каталог Продукции
              </Link>
            </li>

            {/* <li className=" md:hidden">
              <select name="" id="">
                <option value="ru">ru</option>
                <option value="uz">uz</option>
              </select>
            </li> */}
            <li className=" md:hidden">
              <div
                onClick={() => {
                  setOpenModal(true);
                }}
                className="flex py-[10px] button px-[30px] cursor-pointer">
                КОНСУЛЬТАЦИЯ
              </div>
            </li>
          </ul>
        </nav>
      </header>
      {Burger ? (
        <div className=" hidden md:block fixed h-full w-fit right-0 bg-white max-w-[320px] py-8 z-[9999]">
          <AiOutlineClose
            onClick={() => {
              setBurger(!Burger);
            }}
            className="text-[#C5E500] text-[30px] absolute top-5 right-[40px]"
          />
          <div className="flex h-full flex-col items-center  justify-between">
            <div className=" flex flex-col items-center gap-5 p-5 md:w-[100%] md:justify-between ">
              <div className="hidden sm:block"></div>
              <div>
                <Link to={'/'}>
                  <img src="/logo.svg" alt="" />
                </Link>
              </div>
              <Link to={'/search'}>
                <li className=" py-3 px-3 cursor-pointer  flex items-center gap-3    ">
                  <AiOutlineSearch className="text-[#C5E500] text-[25px]" />
                  <p>Поиск</p>
                </li>
              </Link>
              <div className="  flex flex-col items-center gap-5 mt-7">
                <div className=" text-[14px] leading-[14px] font-[500]">
                  <Link to={'/catalog'}> Каталог Продукции</Link>
                </div>
                {/* <div className=" flex gap-2 ">
                  <p>Язык:</p>
                  <select name="" id="">
                    <option value="ru">ru</option>
                    <option value="uz">uz</option>
                  </select>
                </div> */}
                <div className=" ">
                  <div
                    onClick={() => {
                      setOpenModal(true);
                      setBurger(false);
                    }}
                    className="flex py-[10px] button px-[30px]">
                    КОНСУЛЬТАЦИЯ
                  </div>
                </div>
              </div>
            </div>

            <div className="burgerLinks">
              <div className="telBurger flex">
                <BsTelephone className=" text-[24px]" />
                <a href="tel:+998910130013" className="ml-5">
                  <p>+998 91 013 00 13</p>
                </a>
              </div>
              <a href="mailto:">
                <AiOutlineMail className=" text-[24px]" />
                <p className="ml-5">oxriverconstruction@info.com</p>
              </a>
              <a href="https://yandex.uz/maps/-/CCUOjBx~2B">
                <FaMapMarkerAlt className=" text-[24px]" />
                <p className="ml-5">г.Ташкент</p>
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Header;
