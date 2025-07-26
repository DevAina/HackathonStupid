import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Layout from './components/Layout'
import Probleme from './pages/Probleme'
import Gaspillage from './pages/Gaspillage'
import Outils from './pages/Outils'
import Decouverte from './pages/Decouverte'
import Popup from './components/popup' 
import Chat from './pages/Chat'
import Karaks from './pages/Karaks'
import Triche from './pages/Triche'
import Jeux from './pages/Jeux' 

export default function AppRoutes() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        {/* L'index indique que cette route est la route par défaut du parent */}
                        <Route index element={<Probleme />} />
                        <Route path="gaspillage" element={<Gaspillage />} />
                        <Route path="outils" element={<Outils />} />
                        <Route path="decouverte" element={<Decouverte />} />
                        <Route path="chat" element={<Chat />} />
                        <Route path="karaks" element={<Karaks />} />
                        <Route path="Triche" element={<Triche />} />
                        <Route path="jeux" element={<Jeux />} />
                    </Route>
                </Routes>
                <Popup />
            </BrowserRouter>
        </>
    )
}