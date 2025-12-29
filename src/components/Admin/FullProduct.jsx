import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

export default function FullProduct() {
  const {productKey} = useParams();
  const goods = useSelector((state) => state.goods.data);
  const [product, setProduct] = useState([]);
  const [productItems, setProductItems] = useState([]);
  const newArr = Object.values(goods);
  console.log(goods);
  // console.log('array key', newArr[0].key);

  useEffect(() => {
    setProduct([...newArr.filter((i) => i.key == productKey)]);
    // setProductItems([...newArr.filter((i) => i.key == productKey)][0]);
  }, [goods, productKey]);


  console.log(product);

  // useEffect(() => {
  //   if (newArr.length > 0) {

  //   }},[])
  return <div>FullProduct</div>;
}
