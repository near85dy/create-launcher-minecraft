import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {

  useEffect(() => {
    // Отправляем сообщение в main процесс
    window.electronAPI.sendMessage("ping", "Hello wrold 123123123");
    
    // Слушаем ответ от main процесса
    window.electronAPI.onMessage("pong", (response) => {
      console.log("Получен ответ от main процесса:", response);
    });

    // Очистка при размонтировании компонента
    return () => {
      window.electronAPI.removeListener("pong");
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route>
          
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
