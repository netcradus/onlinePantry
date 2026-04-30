import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/global.css'
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import { theme } from '@/styles/theme'

import { SocketProvider } from './context/SocketContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <SocketProvider>
                <ThemeProvider theme={theme}>
                    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                        <App />
                    </BrowserRouter>
                </ThemeProvider>
            </SocketProvider>
        </Provider>
    </React.StrictMode>,
)
