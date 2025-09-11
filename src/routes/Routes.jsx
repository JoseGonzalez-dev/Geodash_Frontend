import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { HomePage } from "../pages/HomePage"
import { GameMode } from "../pages/GameMode"
import { Layout } from "../components/Layout"
import NivelFacil from "../components/Levels/NivelFacil"
import NivelMedio from "../components/Levels/NivelMedio"
import NivelDificil from "../components/Levels/NivelDificil"
import { Login } from "../components/Auth/Login"
import { Register } from "../components/Auth/Register"
import { UpdateUserPage } from "../pages/UserPages/UpdateUser"
import { ChangePassword } from "../pages/UserPages/ChangePassword"
 
const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <HomePage />
 
        },
        {
            path: "/game",
            element: <Layout />,
            errorElement: <div>404</div>,
            children: [
                {
                    index: true,
                    element: <GameMode />
                },
                {
                    path: "facil",
                    element: <NivelFacil />
                },
                {
                    path: "medio",
                    element: <NivelMedio/>

                },
                {
                    path: "dificil",
                    element: <NivelDificil/>
                }
            ]
        },
        {
            path: '/*',
            element: <div>404</div>
        },
        {
            path: "/login",
            element: <Login />
 
        },
        {
            path: "/register",
            element: <Register />
 
        },
        {
            path: "/updateUser",
            element: <UpdateUserPage />
        },
        { 
            path:"/changePass",
            element: <ChangePassword />
        }

    ]
)
 
export const MyRouter = () => {
    return (
        <RouterProvider router={router} />
    )
}