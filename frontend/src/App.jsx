import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import AgentDetail from './pages/AgentDetail'
import OpsView from './pages/OpsView'
import AlertsView from './pages/AlertsView'
import Settings from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        {({ toggleMenu }) => (
          <Routes>
            <Route path="/" element={<Dashboard toggleMenu={toggleMenu} />} />
            <Route path="/agents/:id" element={<AgentDetail toggleMenu={toggleMenu} />} />
            <Route path="/ops" element={<OpsView toggleMenu={toggleMenu} />} />
            <Route path="/alerts" element={<AlertsView toggleMenu={toggleMenu} />} />
            <Route path="/settings" element={<Settings toggleMenu={toggleMenu} />} />
          </Routes>
        )}
      </Layout>
    </BrowserRouter>
  )
}
