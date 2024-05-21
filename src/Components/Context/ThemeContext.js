'use client'

import React, { createContext, useState } from "react";

export const ThemeContext = React.createContext()

export const ThemeProvider = ({children})=> {
    const [mode, setMode] = useState('light')
    const toggleMode = ()=> {
        setMode(mode === 'light' ? 'dark' : 'light')

    }
    return (
        <ThemeContext.Provider value={{
            mode,
            toggleMode,
        }}>
            <div className={`theme ${mode}`}>
            {children}
            </div>
        </ThemeContext.Provider>
    )
}