import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; 
import { apiClient } from "../utils/api";


export const fetchCoating = createAsyncThunk('getGoodAPI/coating', async()=>{
  const {data} = await apiClient.get("/coatings");
  return data.map((item) => item.name);
})


const initialState = {
  coating: [] ,
  status: 'loading'
}




export const coatingSlice = createSlice ({
  name: "coating",
  initialState, 
  reducers: {
    getCoating(state, action) { 
      state.coating =action.payload

    }
    

  }, extraReducers: {
    [fetchCoating.pending]: (state) =>{
      state.status = 'loading'
    },
    [fetchCoating.fulfilled]: (state, action) =>{
      state.status = 'success' 
      state.coating = action.payload
    },
    [fetchCoating.rejected]: (state) =>{
      state.status = 'error' 
      state.coating = []
    }
  }



})


export const {getCoating} = coatingSlice.actions 
export default coatingSlice.reducer
