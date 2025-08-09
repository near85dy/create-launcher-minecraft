import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'
import { RouterProvider } from 'react-router-dom'
import { router } from '../routes/routes'
import Sidebar from '../sidebar/sibebar'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router}/>
)
