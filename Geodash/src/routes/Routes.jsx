import { createBrowserRouter, RouterProvider, Route, Routes } from "react-router-dom"
import { HomePage } from "../pages/HomePage"

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <HomePage />,
            errorElement: <div>404</div>
        },
        {
            path: "/dashboard",
            element: <div>hola despues de play</div>,
            children: [
                {
                    element: <div>hola despues de play</div>
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