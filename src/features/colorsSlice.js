import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; 
import axios from "axios";


export const fetchColors = createAsyncThunk('getGoodAPI/colors', async()=>{
  const {data} = await axios.get("https://oxmetal-49832-default-rtdb.asia-southeast1.firebasedatabase.app/Colors.json");
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



