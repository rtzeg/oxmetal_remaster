import React, { useState } from 'react';
import styles from './Admin.module.scss';

export default function Coating({
  coating,
  addSelectCoating,
  activeCoat,
  setActiveCoat,
  setIsCoatingModal,
}) {
  console.log(coating);
  const [data, setData] = useState([]) 
 
 

  return (
    <div className="border-b-2 py-4">
      <h2 className="opacity-[60%] text-[20px]">Покрытие</h2>
      <div className="flex gap-2 items-center flex-wrap">
        {coating?.map((coat, idx) => (
          <div
            onClick={() => {
              addSelectCoating(coat, idx);
            }}
            className="flex flex-col mt-2"
            key={idx}>
            <div
              onClick={() => setActiveCoat(idx)}
              // onClick={() => setActiveColor(idx)}
              className={activeCoat === idx ? styles['active-coating'] : ''}
              style={{
                border: '1px solid #c5e500',
                borderRadius: '8px',
                cursor: 'pointer',
                padding: '15px',
                fontWeight: '700',
              }}>
              {coat.length > 10 ? coat : coat.toString()}
            </div>
          </div>
        ))}
        <div
          onClick={() => setIsCoatingModal(true)}
          className="flex ml-1 items-center justify-center">
          <div className="w-[50px] flex  text-[20px] font-bold bg-[#c5e500] cursor-pointer items-center justify-center h-[50px] border rounded-[50%]">
            +
          </div>
        </div>
      </div>
    </div>
  );
}
