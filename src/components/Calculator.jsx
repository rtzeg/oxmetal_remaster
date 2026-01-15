/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

const Calculator = ({ product }) => {

  const [Calc, setCalc] = useState([
    {
      id: Math.random(),
      width: 0,
      count: 0,
    },
  ]);
  const [TotalPrice, setTotalPrice] = useState(0);
  const [TotalLength, setTotalLength] = useState(0);
  const [TotalCount, setTotalCount] = useState(0);
  const calcWidth = Number(product?.calcwidth || 0);
  const usesAreaCalc = calcWidth > 0;


  function ChangeWidth(idx, value) {
    let cop = [...Calc];
    cop[idx].width = Number(value);
    setCalc([...cop]);
  }
  function ChangeCount(idx, value) {
    let cop = [...Calc];
    cop[idx].count = Number(value);
    setCalc([...cop]);
  }
  function Delete(idx) {
    let cop = [...Calc];
    cop.splice(idx, 1);
    setCalc([...cop]);
  }
  useEffect(() => {
    let totalCount = 0;
    let totalPrice = 0;
    let totalLength = 0;
    for (let item of Calc) {
      const count = Number(item.count || 0);
      const length = Number(item.width || 0);
      totalCount += count;
      if (usesAreaCalc) {
        totalLength += length * count;
        totalPrice += length * calcWidth * product.price * count;
      } else {
        totalPrice += count * product.price;
      }
    }
    setTotalPrice(totalPrice);
    setTotalLength(usesAreaCalc ? totalLength * calcWidth : 0);
    setTotalCount(totalCount);
  }, [Calc, usesAreaCalc, calcWidth, product.price]);

  return (
    <div className="Calcmain px-5 sm:px-0 ll:flex-col">
      <div className="calc ll:w-full">
        {Calc.map((item, idx) => (
          <div className="calcCont" key={idx + item.id}>
            <div className="calcItem">
              {usesAreaCalc && (
                <div className="calcTitle">
                  <p>ДЛИНА , М:</p>
                  <input
                    type="text"
                    onChange={(e) => {
                      ChangeWidth(idx, e.target.value);
                    }}
                    placeholder="0"
                    id="calcInp"
                    defaultValue={item.width > 0 ? item.width : ""}
                  />
                </div>
              )}
              <div className="calcTitle">
                <p>{usesAreaCalc ? "КОЛ-ВО , ШТ:" : "КОЛИЧЕСТВО, ШТ:"}</p>
                <input
                  type="text"
                  id="calcInp"
                  onChange={(e) => {
                    ChangeCount(idx, e.target.value);
                  }}
                  placeholder="0"
                  defaultValue={item.count > 0 ? item.count : ""}
                />
              </div>
              {usesAreaCalc && (
                <div className="calcTitle">
                  <p>ШИРИНА , М:</p>
                  <input
                    type="text"
                    id="calcInp"
                    defaultValue={product.calcwidth}
                    className="readonlyInp"
                  />
                </div>
              )}
              {
                Calc.length > 1 ?  <div
                className="deleteCalc"
                onClick={() => {
                  if(Calc.length > 1){
                    Delete(idx);
                  }
                 
                }}
              >
                <img src="/icons/musorca.svg" className=" w-1/2" />
              </div> : null
              }
             
            </div>
          </div>
        ))}
        {usesAreaCalc && (
          <div
            className="calcOptions"
            onClick={() => {
              setCalc([
                ...Calc,
                {
                  id: Math.random(),
                  width: 0,
                  count: 0,
                },
              ]);
            }}
          >
            <img
              src="/icons/1564491_add_create_new_plus_icon.svg"
              width="16px"
              alt=""
            />
            <span>ДОБАВИТЬ ЛИСТ ДРУГОЙ ДЛИНЫ</span>
          </div>
        )}
      </div>

      <div className="calcTotal ll:w-full">
        <div className="calcTotalResult">
          <h1 className="calcPrice">
            {TotalPrice.toLocaleString("ru-RU")} сум
          </h1>
          <p>
            {usesAreaCalc ? (
              <>
                ОБЩИЙ МЕТРАЖ ЗАКАЗА:{" "}
                <span className="calcMetr">
                  {TotalLength.toLocaleString("ru-RU")}
                </span>{" "}
                м<sup>2</sup>
              </>
            ) : (
              <>
                ОБЩЕЕ КОЛИЧЕСТВО:{" "}
                <span className="calcMetr">
                  {TotalCount.toLocaleString("ru-RU")}
                </span>{" "}
                шт.
              </>
            )}
          </p>
        </div>
        <div className="calcTotalOptions">
          <button className="consultation mtnon" id="consultation">
            <img src="/icons/phone.svg" alt="" />
            <p>КОНСУЛЬТАЦИЯ</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
