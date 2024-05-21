'use client'

import React, { useState } from 'react'
import styles from './register.module.css'
import Image from 'next/image'
import {useRouter} from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function Register() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const supabase = createClientComponentClient();

    const handleSignUp = async () => {
        const res = await supabase.auth.signUp({
            name,
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        })
        setUser(res.data.user)
        router.refresh()
        setName('')
        setEmail('')
        setPassword('')
    }

    return (
        <div className={styles.main}>
            <div className={styles.etape2Contain}>
                <div className={styles.etape2LeftBox}>
                    <div className={styles.etape2AnimLogo}>
                        <Image className={styles.etape2Logo} src='/realMatch.png' width={100} height={100} alt="logo" />
                    </div>
                    <div className={styles.etape2TextCarossel}>
                        <h2>Bienvenu(e) a <strong>Match</strong>. <br />Creez votre compte ici.</h2>
                    </div>
                </div>
                <div className={styles.etape2RightBox}>
                    <div className={styles.etape2TextEtape1}>
                        <h3>Informations de connexion</h3>
                    </div>

                    <form className={styles.form} action="/">
                        <div className={`${styles.etape2Identifiant} ${styles.divMarge}`}>
                            <label htmlFor="nom d'utilisateur">Identifiant</label>
                            <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder="Nom d'utilisateur" required />
                        </div>
                        <div className={`${styles.etape2Identifiant} ${styles.divMarge}`}>
                            <label htmlFor="email">Addresse Email</label>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder='Homerbush@exemple.com' required />
                        </div>
                        <div className={`${styles.etape2Identifiant} ${styles.divMarge}`}>
                            <label htmlFor="nom d'utilisateur">Mot de passe</label>
                            <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder='Mot de passe' required />
                        </div>
                        <button onClick={handleSignUp} type='button' className={styles.etape2Button}>Creer le compte</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
