'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './login.module.css'
import GoogleSign from '../../Components/GoogleSign/GoogleSign'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Loading from '../loading/page'
import Home from '../page'
import { FcGoogle } from "react-icons/fc";

export default function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()
    const supabase = createClientComponentClient();
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            setLoading(false)
        }

        getUser();
    }, [])



    const handleSignIn = async () => {
        const res = await supabase.auth.signInWithPassword({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        })
        setUser(res.data.user)
        router.refresh()
        setEmail('')
        setPassword('')
    }

    if (loading) {
        return <Loading />
    }
    if (user) {
        return <Home />
    }
    // console.log(user);


    return (
        <div className={styles.main}>
            <div className={styles.contain}>
                <div className={styles.leftBox}>
                    <div className={styles.animLogo}>
                        <Image className={styles.logo} src='/realMatch.png' width={100} height={100} alt="logo" />
                    </div>
                    <div className={styles.textCarossel}>
                        <h2>Bienvenu(e) a <strong>Match</strong>. <br />Veuillez vous connecter.</h2>
                    </div>
                </div>
                <div className={styles.rightBox}>
                    <div className={styles.textUp}>
                        <h3>Avec votre identifiant</h3>
                    </div>

                    <form className={styles.form} action="/">
                        <div className={styles.identifiant}>
                            <label htmlFor="identifiant">Address Email</label>
                            <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Address Email" required />
                        </div>
                        <div className={styles.password}>
                            <label htmlFor="password">Mot de passe</label>
                            <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder='Mot de passe' required />
                        </div>


                        <button onClick={handleSignIn} className={styles.button}>
                            Se connecter
                        </button>

                    </form>

                    <div className={styles.textMiddle}>
                        <h3>Ou</h3>
                    </div>

                    <GoogleSign />

                    <div className={styles.othersPart}>
                        <div className={styles.creation}>
                            <h2>Pas de compte ? <Link href={'/login/register'} className={styles.creationLink}>Creez votre compte</Link></h2>
                        </div>
                        <div className={styles.reinitialisation}>
                            <h2>Mot de passe oublie ? <Link href={''} className={styles.creationLink}>Reinitialisez le mot de passe</Link></h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
