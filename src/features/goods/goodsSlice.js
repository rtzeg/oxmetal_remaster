import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { deleteGoodAPI, getGoodAPI, pathGoodAPI, postGoodAPI } from "./thunk";




const initialState = {
  data: [],
  status: "idle",
};

export const goodsSlice = createSlice({
  name: "goods",
  initialState,
  reducers: {
    getGoods: (state, action) => {
      state.data = state.data;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getGoodAPI.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getGoodAPI.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "fulfilled";
      })
      .addCase(getGoodAPI.rejected, (state, action) => {
        state.status = "rejected";
      })



      .addCase(postGoodAPI.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(postGoodAPI.fulfilled, (state, action) => {
        state.status = 'fulfilled';
    
  
        // Add the data to the state as an array
        state.data.push(action.payload); // Добавляем данные в массив
      })
      .addCase(postGoodAPI.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = [];
      })


      
      .addCase(pathGoodAPI.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(pathGoodAPI.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "fulfilled";
      })
      .addCase(pathGoodAPI.rejected, (state, action) => {
        state.status = "rejected";
      })
      .addCase(deleteGoodAPI.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteGoodAPI.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "fulfilled";
      })
      .addCase(deleteGoodAPI.rejected, (state, action) => {
        state.status = "rejected";
      });
  },
});

export const { getGoods } = goodsSlice.actions;

export default goodsSlice.reducer;
