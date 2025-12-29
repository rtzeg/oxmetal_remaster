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
    for (let item of Calc) {
      totalCount += item.width;
      totalPrice += item.width * product.price * item.count;
    }
    if (totalPrice === 0) {
      setTotalPrice(product.price);
      setTotalLength(1);
    } else {
      setTotalPrice(totalPrice);
      setTotalLength(totalCount * product.calcwidth);
    }
  }, [Calc]);

  return (
    <div className="Calcmain px-5 sm:px-0 ll:flex-col">
      <div className="calc ll:w-full">
        {Calc.map((item, idx) => (
          <div className="calcCont" key={idx + item.id}>
            <div className="calcItem">
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
              <div className="calcTitle">
                <p>КОЛ-ВО , ШТ:</p>
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
              <div className="calcTitle">
                <p>ШИРИНА , М:</p>
                <input
                  type="text"
                  id="calcInp"
                  defaultValue={product.calcwidth}
                  className="readonlyInp"
                />
              </div>
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
      </div>

      <div className="calcTotal ll:w-full">
        <div className="calcTotalResult">
          <h1 className="calcPrice">
            {TotalPrice.toLocaleString("ru-RU")} сум
          </h1>
          <p>
            ОБЩИЙ МЕТРАЖ ЗАКАЗА:{" "}
            <span className="calcMetr">
              {TotalLength.toLocaleString("ru-RU")}
            </span>{" "}
            м<sup>2</sup>
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
