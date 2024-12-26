import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    // başlangıç değerleri
    // cartItems: [],
    // total: 0,
    // tax: 8,

    //eğer localstorage de kayıtlı cart adında veri varsa oradan çek, ilk değer olarak  yoksa boş değer gelsin
    cartItems: localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart")).cartItems
      : [],
    total: localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart")).total
      : 0,
    tax: 8,
  },

  //fonksiyon yazılan alan reducers
  //action alanı addProduct methodu ile göndrilen verilen kısmı
  //reducers içerisindeli alan actions olarak geçer
  //state, initalState içerindkei herşey
  reducers: {
    addProduct: (state, action) => {
      /***
       * cartItems'ın içindeki tüm verilerin id'sine bak, eğer tıklanan ürünün id si ile aynı ise
       * finCartItem içine at
       *
       * tıklanan item'ı bulma işlem
       */
      const findCartItem = state.cartItems.find(
        (item) => item.id === action.payload.id
      );
      if (findCartItem) {
        //eğer varsa
        findCartItem.quantity++; //quantity değerini 1 artır
      } else {
        state.cartItems.push(action.payload); //yoksa zaten tıklanan ürünü direk gönder
      }
      state.total += action.payload.price; //sepete eklenen ürünlerin toplamını gönderir
    },
    deleteCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload.id
      );
      state.total -= action.payload.price * action.payload.quantity; // sepetten çıkarılan ürünler,n fiyatları toplamdan azaltılır.
    },
    increase: (state, action) => {
      const cartItem = state.cartItems.find(
        //tıklanan item(ürün bilgileri) bulunur
        (item) => item.id === action.payload.id
      );
      cartItem.quantity += 1;
      state.total += cartItem.price
    },
    decrease: (state, action) => {
      const cartItem = state.cartItems.find(
        //tıklanan item(ürün bilgileri) bulunur
        (item) => item.id === action.payload.id
      );
      cartItem.quantity -= 1;

      if (cartItem.quantity === 0) {
        state.cartItems = state.cartItems.filter(
          (item) => item.id !== action.payload.id
        );
      }
      state.total -= cartItem.price
    },
    reset : (state, action) => {
      state.cartItems = []
      state.total = 0
    }
  },
});

export const { addProduct, deleteCart, increase, decrease, reset } = cartSlice.actions;
export default cartSlice.reducer;
