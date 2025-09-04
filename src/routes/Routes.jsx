import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { HomePage } from "../pages/HomePage"
import { GameMode } from "../pages/GameMode"
import { Layout } from "../components/Layout"
import { Login } from "../components/Auth/Login"
import { Register } from "../components/Auth/Register"
 
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
 
        }
    ]
)
 
export const MyRouter = () => {
    return (
        <RouterProvider router={router} />
    )
}