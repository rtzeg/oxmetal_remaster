// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import "./catalog.scss";
import { useSelector } from "react-redux";
import ProductCart from "../components/ProductCart";
import RadioBtns from "../components/RadioBtns";
import ColorBtns from "../components/ColorBtns";
import { scrollToElement } from "../../utils/functions";

const Catalog = () => {
  const goods = useSelector((state) => state.goods.data);
  const newArr = Object.values(goods) 

  const [FillGoods, setFillGoods] = useState([...newArr]);
  const uniqueColors = [];
  const uniqueTypes = [];
  const uniqueMaterials = [];
  const [ActiveMaterial, setActiveMaterial] = useState("");
  const [ActiveTypes, setActiveTypes] = useState("");
  const [ActiveColors, setActiveColors] = useState("");
  const [Count, setCount] = useState(6);
  newArr.forEach((item) => {
    item.color.forEach((color) => {
      const existingColor = uniqueColors.find(
        (uniqueColor) => uniqueColor.name === color.name
      );
      if (!existingColor) {
        uniqueColors.push(color);
      }
    });

    if (!uniqueTypes.includes(item.tipes)) {
      uniqueTypes.push(item.tipes);
    }

    if (!uniqueMaterials.includes(item.material)) {
      uniqueMaterials.push(item.material);
    }
  });
 
  useEffect(() => {
    if(localStorage.getItem("fillGood")){
      setFillGoods([...newArr.filter(i => i.material == localStorage.getItem("fillGood"))]);
      setActiveMaterial(localStorage.getItem("fillGood"))
      if(localStorage.getItem("fillGoodProfile")){
        setActiveTypes(localStorage.getItem("fillGoodProfile"))
      }
      setTimeout(()=>{
        localStorage.clear()
      } , 3000)
    }else{
      setFillGoods([...newArr]);
    }

  
  }, [goods]);
  useEffect(() => {
    if (
      ActiveMaterial.length > 0 ||
      ActiveTypes.length > 0 ||
      ActiveColors.length > 0
    ) {
      let copGoods = [...newArr];
      if (ActiveMaterial.length > 0) {
        copGoods = copGoods.filter((item) => item.material === ActiveMaterial);
      }
      if (ActiveTypes.length > 0) {
        copGoods = copGoods.filter((item) => item.tipes === ActiveTypes);
      }
      if (ActiveColors.length > 0) {
        let aa = [];
        for (let i of copGoods) {
          if (
            i.color.filter((item) => item.name === ActiveColors.toString())
              .length > 0
          ) {
            aa.push(i);
          }
        }
        copGoods = aa;
      }

      setFillGoods(copGoods);
    }
  }, [ActiveMaterial, ActiveTypes, ActiveColors]);

  useEffect(()=>{
    scrollToElement('filter'); 
  },[])
  useEffect(() => {
    let FilterModal = document.querySelector(".FilterModal");
    let CloseFilterModal = document.querySelector(".CloseFilterModal");
    let openFilter = document.querySelector(".openFilter");
    openFilter.onclick = () => {
      FilterModal.style.display = "block";
    };
    CloseFilterModal.onclick = () => {
      FilterModal.style.display = "none";
    };
   
   

  });
  return (
    <div  className="catalog_page pt-[50px] ">
      <div className="catalog_page_mask Anchor">
        <h1>Каталог товаров</h1>
      </div>
      <div id="filter"  className="catalogFilter scroll-mt-[100px]">
        <div className="metalInfo"></div>
        <div className="FilteredProducts">
          <div className="FilterOptionsMain">
            <div className="FilterModal">
              <img
                className="CloseFilterModal"
                src="/icons/close.png"
                alt=""
              />
              <div className="acor_catalog-container">
                {/* <!-- <input type="checkbox" name="chacor" id="chacor6" />
                <label for="chacor6">Вид</label>
                <div className="acor_catalog-body">
  
                </div> --> */}

                <input type="checkbox" name="chacor" id="chacor8" />
                <label className="" htmlFor="chacor8">
                  Категория товаров
                </label>
                <div className="acor_catalog-body">
                  {uniqueMaterials.length > 0
                    ? uniqueMaterials.map((item, idx) => (
                        <>
                          {item.length > 0 ? (
                            <RadioBtns
                              elem={item}
                              key={item + idx}
                              Active={ActiveMaterial}
                              setActive={setActiveMaterial}
                            />
                          ) : null}
                        </>
                      ))
                    : null}
                </div>

                <input type="checkbox" name="chacor" id="chacor9" />
                <label className="" htmlFor="chacor9">
                  Профиль
                </label>
                <div className="acor_catalog-body">
                  {uniqueTypes.length > 0
                    ? uniqueTypes.map((item, idx) => (
                        <>
                          {item.length > 0 ? (
                            <RadioBtns
                              elem={item}
                              key={item + idx}
                              Active={ActiveTypes}
                              setActive={setActiveTypes}
                            />
                          ) : null}
                        </>
                      ))
                    : null}
                </div>
                <input type="checkbox" name="chacor" id="chacor5" />
                <label htmlFor="chacor5">Цвет</label>
                <div className="acor_catalog-body grid grid-cols-3">
                  {uniqueColors.length > 0
                    ? uniqueColors.map((item, idx) => (
                        <>
                          <ColorBtns
                            elem={item}
                            key={item.name + idx}
                            Active={ActiveColors}
                            setActive={setActiveColors}
                          />
                        </>
                      ))
                    : null}
                </div>
              </div>
            </div>
            <div className="FilterOptions">
              <div className="openFilter">
                <img src="/icons/filter.png" width="38px" alt="" />
                <span>Фильтр</span>
              </div>
              <p
                onClick={() => {
                  setActiveMaterial("");
                  setActiveTypes("");
                  setActiveColors("");
                  setFillGoods([...newArr]);
                }}
                id="CancelFillter"
              >
                Сбросить фильтр
              </p>
            </div>
          </div>
          <div className="mx-auto">
            <div className="FilterConteiner">
              {FillGoods.length > 0 ? (
                FillGoods.slice(0, Count).map((item, idx) => (
                  <ProductCart
                    key={idx}
                    Product={item}
                    idx={
                      ActiveColors.length === 0
                        ? Math.floor(Math.random() * item.color.length)
                        : item.color.indexOf(
                            item.color.filter(
                              (item) => item.name === ActiveColors.toString()
                            )[0]
                          )
                    }
                  />
                ))
              ) : (
                <>
                  <img
                    src="https://us.123rf.com/450wm/petersnow/petersnow1911/petersnow191100017/134503210-illustration-for-404-error-vector-webpage-template-concept-for-page-not-found-problem-creative.jpg?ver=6"
                    alt=""
                  />
                </>
              )}
            </div>

            {FillGoods.length >= Count ? (
              <>
                {Count >= FillGoods.length || Count === FillGoods.length ? (
                  <div
                    onClick={() => {
                      FillGoods.length <= Count
                        ? setCount(6)
                        : setCount(Count + 6);
                    }}
                  >
                    <div className="FilterConteinerAddPlus">Свернуть</div>
                  </div>
                ) : null}
              </>
            ) : null}
            {Count < FillGoods.length ? (
              <div
                onClick={() => {
                  FillGoods.length <= Count ? setCount(6) : setCount(Count + 6);
                }}
              >
                <div className="FilterConteinerAddPlus">Показать еще</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
