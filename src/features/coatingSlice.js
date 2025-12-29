import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; 
import axios from "axios";


export const fetchCoating = createAsyncThunk('getGoodAPI/coating', async()=>{
  const {data} = await axios.get("https://oxmetal-49832-default-rtdb.asia-southeast1.firebasedatabase.app/Coating.json");
  return data;
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
