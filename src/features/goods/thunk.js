import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";







export const getGoodAPI = createAsyncThunk("goods/getGoodAPI", async () => {
  
  const res = await axios.get(

    "https://oxmetal-49832-default-rtdb.asia-southeast1.firebasedatabase.app/Products.json"
  );

  return res.data;
});
export const postGoodAPI = createAsyncThunk(
  "goods/postGoodAPI",
  async (data) => {
   
    const res = await axios.post(
      "https://oxmetal-49832-default-rtdb.asia-southeast1.firebasedatabase.app/Products.json",
      data
    );

    return res.data;
  }
);
export const pathGoodAPI = createAsyncThunk(
  "goods/pathGoodAPI",
  async (data) => { 
    console.log(data); 
    const res = await axios.patch(
      "https://oxmetal-49832-default-rtdb.asia-southeast1.firebasedatabase.app/Products/-NsHNN90I1nWU6QkydOP.json",data
   
    );

    return res.data;
  }
);
export const deleteGoodAPI = createAsyncThunk(
  "goods/deleteGoodAPI",
  async (data) => {
    const res = await axios.delete("http://localhost:3001/goods/" + data);

    return res.data;
  }
);
