import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../utils/api";







export const getGoodAPI = createAsyncThunk("goods/getGoodAPI", async () => {
  const res = await apiClient.get("/products");
  return res.data;
});
export const postGoodAPI = createAsyncThunk(
  "goods/postGoodAPI",
  async (data) => {
    const res = await apiClient.post("/products", data);
    return res.data;
  }
);
export const pathGoodAPI = createAsyncThunk(
  "goods/pathGoodAPI",
  async (data) => { 
    const res = await apiClient.put(`/products/${data.id}`, data.payload);
    return res.data;
  }
);
export const deleteGoodAPI = createAsyncThunk(
  "goods/deleteGoodAPI",
  async (data) => {
    const res = await apiClient.delete(`/products/${data}`);
    return res.data;
  }
);
