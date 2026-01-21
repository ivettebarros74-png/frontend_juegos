import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { Inicio } from '../pages/Inicio'
import { Games } from '../pages/Games'
import { SobreNosotros } from '../pages/SobreNosotros'
import { Contacto } from '../pages/Contacto'
import { Dashboard } from '../components/Dashboard' 
import { SumaRapida } from '../pages/games/SumaRapida'
import { RestaChampions } from '../pages/games/RestaChampions'
import { MultiplicacionMaster } from '../pages/games/MultiplicacionMaster'
import { DivisionVeloz } from '../pages/games/DivisionVeloz'
import { EcuacionesPro } from '../pages/games/EcuacionesPro'
import { GeometriaEspacial } from '../pages/games/GeometriaEspacial'


export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout><Inicio /></MainLayout>} />
      <Route path="/juegos" element={<MainLayout><Games /></MainLayout>} />
      <Route path="/sobre-nosotros" element={<MainLayout><SobreNosotros /></MainLayout>} />
      <Route path="/contacto" element={<MainLayout><Contacto /></MainLayout>} />
      <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
      
      {/* Rutas de juegos */}
      <Route path="/juego/6" element={<SumaRapida />} />
      <Route path="/juego/4" element={<MultiplicacionMaster />} />
      <Route path="/juego/1" element={<DivisionVeloz />} />
      <Route path="/juego/5" element={<RestaChampions />} />
      <Route path="/juego/2" element={<EcuacionesPro />} />
      <Route path="/juego/3" element={<GeometriaEspacial />} />
    </Routes>
  )
}