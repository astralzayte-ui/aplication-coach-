import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useApp } from './context/AppContext'

import Auth from './screens/Auth'
import Store from './screens/onboarding/Store'
import Budget from './screens/onboarding/Budget'
import People from './screens/onboarding/People'
import Ambiance from './screens/onboarding/Ambiance'
import Diet from './screens/onboarding/Diet'
import Meals from './screens/onboarding/Meals'
import Equipment from './screens/onboarding/Equipment'
import Loading from './screens/Loading'
import Plan from './screens/Plan'
import MealDetail from './screens/MealDetail'
import Shopping from './screens/Shopping'
import Fridge from './screens/Fridge'
import Weeks from './screens/Weeks'
import Trial from './screens/Trial'
import Settings from './screens/Settings'

function Guard({ children }: { children: ReactNode }) {
  const { state, hasPlan } = useApp()
  const loc = useLocation()
  const path = loc.pathname

  if (!state.loggedIn && path !== '/auth') return <Navigate to="/auth" replace />
  if (state.loggedIn && path === '/auth') {
    return <Navigate to={hasPlan ? '/plan' : '/ob/store'} replace />
  }
  // logged in but no plan yet → must go through onboarding
  const inFlow = path.startsWith('/ob') || path === '/loading'
  if (state.loggedIn && !hasPlan && !inFlow) return <Navigate to="/ob/store" replace />

  return <>{children}</>
}

export default function App() {
  return (
    <div className="app">
      <HashRouter>
        <Guard>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/ob/store" element={<Store />} />
            <Route path="/ob/budget" element={<Budget />} />
            <Route path="/ob/people" element={<People />} />
            <Route path="/ob/ambiance" element={<Ambiance />} />
            <Route path="/ob/diet" element={<Diet />} />
            <Route path="/ob/meals" element={<Meals />} />
            <Route path="/ob/equipment" element={<Equipment />} />
            <Route path="/loading" element={<Loading />} />
            <Route path="/plan" element={<Plan />} />
            <Route path="/meal/:day/:type" element={<MealDetail />} />
            <Route path="/shopping" element={<Shopping />} />
            <Route path="/fridge" element={<Fridge />} />
            <Route path="/weeks" element={<Weeks />} />
            <Route path="/trial" element={<Trial />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        </Guard>
      </HashRouter>
    </div>
  )
}
