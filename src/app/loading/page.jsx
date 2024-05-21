import Image from 'next/image'
import React from 'react'
import styles from './loading.module.css'

export default function Loading() {
    return (
        <div className={styles.main}>
            <div className={styles.animContain}>
                <Image className={styles.myLogo1} src='/realMatch.png' width={100} height={100} alt="logo" />
                <Image className={styles.myLogo2} src='/realMatch.png' width={100} height={100} alt="logo" />
            </div>
        </div>
    )
}
