import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { HomePage } from "../pages/HomePage"
import { GameMode } from "../pages/GameMode"
import { Layout } from "../components/Layout"

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
                // {
                //     path: ':mode',
                //     element: <GameMode />
                // }
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