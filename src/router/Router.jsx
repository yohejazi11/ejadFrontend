import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import AdminDashboard from "../pages/AdminDashboard";
const router = createBrowserRouter([
    {
        path: "/home",
        element: <Home></Home>,
    },
    {
        path: "/dashboard",
        element: <AdminDashboard></AdminDashboard>,
    },

]);

function Router() {

    return <RouterProvider router={router} />;
}

export default Router