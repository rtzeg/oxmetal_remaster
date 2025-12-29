import { Routes, Route } from 'react-router-dom';
import Layout from './Layout/Layout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductPage from './pages/ProductPage';
import SearchPage from './pages/SearchPage';
import Authorization from './components/Authorization/Authorization';
import Admin from './components/Admin/Admin';
import AddItem from './components/Admin/AddItem';
import FullProduct from './components/Admin/FullProduct';
import { createContext, useState } from 'react';
import { AuthCTX } from './contexts/Auth';


function App() {

  const [isAuth, setIsAuth] = useState(true)

  return (
    
    <AuthCTX.Provider value={{isAuth, setIsAuth}}>
              <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" index element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/product/:ProductId" element={<ProductPage />} />
        <Route path="/:ProductId" element={<ProductPage />} />{' '}
      </Route>
      <Route path="/admin" element={<Authorization />} />
      {isAuth && (
    <Route path="/admin/control" element={<Admin />} />
      )}
  
      <Route path="/admin/control/add-item" element={<AddItem />} />
      <Route path="/admin/control/add-item/:productKey/:productIndex" element={<AddItem />} />
    </Routes>

    </AuthCTX.Provider>


   
  
  );
}

export default App;
