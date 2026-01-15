import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; 
import { apiClient } from "../utils/api";


export const fetchColors = createAsyncThunk('getGoodAPI/colors', async()=>{
  const {data} = await apiClient.get("/colors");
  return data;
})


const initialState = {
  colors: [] ,
  status: 'loading'
}




export const colorsSlice = createSlice ({
  name: "colors",
  initialState, 
  reducers: {
    getColor(state, action) { 
      state.colors =action.payload

    }
    

  }, extraReducers: {
    [fetchColors.pending]: (state) =>{
      state.status = 'loading'
    },
    [fetchColors.fulfilled]: (state, action) =>{
      state.status = 'success' 
      state.colors = action.payload
    },
    [fetchColors.rejected]: (state) =>{
      state.status = 'error' 
      state.colors = []
    }
  }



})


export const {getColor} = colorsSlice.actions 
export default colorsSlice.reducer



