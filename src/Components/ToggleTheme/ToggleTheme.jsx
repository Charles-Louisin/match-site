'use client'

import React, { useContext } from 'react'
import styles from './ToggleTheme.module.css'

import { BsMoon } from "react-icons/bs";
import { BsSun } from "react-icons/bs";
import { useTheme } from 'next-themes';

export default function ToggleTheme() {

    const { theme, setTheme } = useTheme();
    const currentTheme = theme === 'system' ? setTheme : theme;

    return (
        <div className={styles.container}>
            {currentTheme === 'dark' ? (
                <button className={styles.bsSun} onClick={()=> setTheme('light')}>
                    <BsSun />
                </button>
            ) : (
                <button className={styles.bsMoon} onClick={()=> setTheme('dark')}>
                    <BsMoon />
                </button>
            )}
            <p className={styles.themeText}>Theme</p>
        </div>
    )
}
