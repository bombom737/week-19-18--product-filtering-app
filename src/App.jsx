import './App.css';
import { ProductProvider } from './context/productContext';
import MainPage from './views/MainPage';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <ProductProvider>
    <Routes>
      <Route path='/' element={<MainPage />} />
    </Routes>
    </ProductProvider>
  );
}

export default App;
