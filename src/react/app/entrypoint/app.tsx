import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Sidebar from '../sidebar/sibebar'

function App() {

  // useEffect(() => {
  //   window.electronAPI.sendMessage("ping", "Hello wrold 123123123");
    
  //   window.electronAPI.onMessage("pong", (response) => {
  //     console.log("Получен ответ от main процесса:", response);
  //   });

  //   return () => {
  //     window.electronAPI.removeListener("pong");
  //   };
  // }, []);

  return (
    <BrowserRouter>
        <Sidebar/>
    </BrowserRouter>
  )
}

export default App
