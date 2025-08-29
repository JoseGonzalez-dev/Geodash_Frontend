import { createBrowserRouter as Router, Routes, Route, Link, RouterProvider } from "react-router-dom"
import { HomePage } from "../pages/HomePage"
import { GameMode } from "../pages/GameMode"
import { Layout } from "../components/Layout"
import NivelFacil from './components/NivelFacil'
import NivelMedio from './components/NivelMedio'
import NivelDificil from './components/NivelDificil'

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <Layout />,
            errorElement: <div>404</div>,
            children: [
                {
                    index: true,
                    element: <HomePage />
                },
                {
                    path: "game",
                    element: <GameMode />
                }
            ]
        },
        {
            path: '/*',
            element: <div>404</div>
        }
    ]
)

export const MyRouter = () => {
    return (
        <RouterProvider router={router} />
    )
}

const App = () => {
  return (
    <Router>
      <nav>
        <Link to="/facil">Fácil</Link>
        <Link to="/medio">Medio</Link>
        <Link to="/dificil">Difícil</Link>
      </nav>
      <Routes>
        <Route path="/facil" element={<NivelFacil />} />
        <Route path="/medio" element={<NivelMedio />} />
        <Route path="/dificil" element={<NivelDificil />} />
      </Routes>
    </Router>
  )
}