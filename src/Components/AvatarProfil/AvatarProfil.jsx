import React, { useEffect, useState } from 'react'
import styles from './AvatarProfil.module.css'
import Image from 'next/image'
import { BsCamera, BsFillCameraFill } from "react-icons/bs";
import { uploadUserProfilImage } from '../../../helpers/user';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Preloader from '../Preloader/Preloader';

export default function AvatarProfil({editable, url, onChange}) {

    const supabase = createClientComponentClient()
    const [isUploading, setIsUploading] = useState(false)
    const [user, setUser] = useState(null)
    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        
        getUser();
    }, [])

    async function handleAvatarChange(ev) {
        const file = ev.target.files?.[0];
        if(file) {
            setIsUploading(true)
            await uploadUserProfilImage(
                supabase,
                user.id,
                file,
                'avatars',
                'avatar'
            )
            setIsUploading(false)
            if(onChange) onChange();
        }
    }
  return (
    <div className={styles.main}>
    <Image className={styles.profilAvatar} src={url} alt='Profil' width={150} height={150} />
    {isUploading && (
                <div className={styles.containLoad}>
                    <div className={styles.load}>
                        <Preloader />
                    </div>
                </div>
            )}
    {editable && (
        <label className={styles.profilContain}>
            <input type="file" hidden onChange={handleAvatarChange} />
            <BsFillCameraFill className={styles.bsCamera} />
        </label>
    )}
    </div>
  )
}
