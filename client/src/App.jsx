import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Espacios from './pages/Espacios'
import EspacioDetalle from './pages/EspacioDetalle'
import Cajas from './pages/Cajas'
import Items from './pages/Items'
import ItemDetalle from './pages/ItemDetalle'
import EstanteDetalle from './pages/EstanteDetalle'
import CajaDetalle from './pages/CajaDetalle'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="espacios" element={<Espacios />} />
          <Route path="espacios/:id" element={<EspacioDetalle />} />
          <Route path="estantes/:id" element={<EstanteDetalle />} />
          <Route path="cajas/:id" element={<CajaDetalle />} />
          <Route path="cajas" element={<Cajas />} />
          <Route path="items" element={<Items />} />
          <Route path="items/:id" element={<ItemDetalle />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
