// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import ProductCart from '../components/ProductCart';
import { scrollToElement } from '../../utils/functions';

const SearchPage = () => {
  const goods = useSelector((state) => state.goods.data);
  const newGoods = Object.values(goods);

  const inp = useRef(null);
  const [FillGoods, setFillGoods] = useState([]);

  useEffect(() => {
    scrollToElement('search');
  }, []);
  function searchObjects(inputValue) {
    const searchTerms = inputValue.toLowerCase().split(' ');

    const filteredObjects = newGoods.filter((obj) => {
      return searchTerms.every((term) => {
        return (
          obj.tipes.toLowerCase().includes(term) ||
          obj.view.toLowerCase().includes(term) ||
          obj.sizes.toLowerCase().includes(term) ||
          obj.material.toLowerCase().includes(term) ||
          obj.coating.toLowerCase().includes(term) ||
          obj.color.some((color) => color.RGBA === term) ||
          (obj.keyWords && obj.keyWords.some((keyword) => keyword.toLowerCase().includes(term)))
        );
      });
    });

    setFillGoods(filteredObjects);
  }
  return (
    <div id="search" className=" bg-[#F2F2F2] min-h-[900px] py-[150px]">
      <div className=" w-full flex flex-col items-center justify-center ">
        <div className="bac py-3 px-3 cursor-pointer w-[600px] flex items-center gap-3  sm:w-full ">
          <AiOutlineSearch className="text-[#C5E500] text-[25px]" />
          <input
            type="text"
            className="outline-none"
            placeholder="Поиск по товарам"
            onChange={(e) => searchObjects(e.target.value)}
            ref={inp}
          />
        </div>
        <div className=" flex flex-wrap gap-7 justify-center mt-10">
          {FillGoods.length > 0 && inp.current.value.length > 0
            ? FillGoods.map((item, idx) => <ProductCart key={idx} Product={item} />)
            : 'Что вы ищите?'}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
