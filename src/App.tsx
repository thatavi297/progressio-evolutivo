import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import AppLayout from './components/AppLayout'
import ProtectedRoute from './components/ProtectedRoute'

import Dashboard from './pages/Dashboard'
import ExerciseDetails from './pages/ExerciseDetails'
import Exercises from './pages/Exercises'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Progress from './pages/Progress'
import Workouts from './pages/Workouts'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        element={
          <ProtectedRoute />
        }
      >
        <Route
          element={<AppLayout />}
        >
          <Route
            path="/dashboard"
            element={
              <Dashboard />
            }
          />

          <Route
            path="/exercicios"
            element={
              <Exercises />
            }
          />

          <Route
            path="/exercicios/:id"
            element={
              <ExerciseDetails />
            }
          />

          <Route
            path="/treinos"
            element={
              <Workouts />
            }
          />

          <Route
            path="/progresso"
            element={
              <Progress />
            }
          />
        </Route>
      </Route>

      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  )
}

export default App