import { configureStore } from "@reduxjs/toolkit";
import goodsSlice from "../features/goods/goodsSlice";
import colorsSlice from "../features/colorsSlice";
import coatingSlice from "../features/coatingSlice";


export const store = configureStore({
  reducer: {
    goods: goodsSlice,
    colors: colorsSlice,

    coating: coatingSlice 

  },
});
