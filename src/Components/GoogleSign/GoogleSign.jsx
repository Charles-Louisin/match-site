'use client'

import Image from 'next/image'
import React from 'react'
import styles from './GoogleSign.module.css'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function GoogleSign() {

  const supabase = createClientComponentClient();
  const router = useRouter()

  const handleSignInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  }

  return (
    <div className={styles.googleAccount}>
      <button onClick={handleSignInWithGoogle} className={styles.buttonGoogle} >
        Se connecter avec
        <Image className={styles.googleLogo} alt='logo' src='/googleLogo.PNG' width={100} height={100} />
      </button>
    </div>
  )
}
