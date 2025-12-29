/* eslint-disable react/prop-types */
import  { useState, useEffect } from 'react';

const NumberCounter = ({ start, end }) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (count < end) {
      const interval = setInterval(() => {
        setCount((prevCount) => prevCount + 1);
      }, 1); // Интервал обновления числа

      return () => {
        clearInterval(interval);
      };
    }
  }, [count, end]);

  return <div>{count}</div>;
};

export default NumberCounter;