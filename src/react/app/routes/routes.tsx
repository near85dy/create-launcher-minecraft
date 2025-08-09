import React from 'react'
import { createBrowserRouter } from "react-router-dom";
import App from "../entrypoint/app";
import { Home } from '../../pages/home';

export const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <App/>
        }
    ]
)