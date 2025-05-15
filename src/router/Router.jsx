import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import AdminDashboard from "../pages/AdminDashboard";
import Login from "../pages/Login";
const router = createBrowserRouter([
    {
        path: "/home",
        element: <Home></Home>,
    },
    {
        path: "/dashboard",
        element: <AdminDashboard></AdminDashboard>,
    },
        {
        path: "/login",
        element: <Login></Login>,
    },

]);

function Router() {

    return <RouterProvider router={router} />;
}

export default Router