import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import styles from './Cover.module.css'
import { BsCamera, BsFillCameraFill } from "react-icons/bs";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Preloader from '../Preloader/Preloader';
import { uploadUserProfilImage } from '../../../helpers/user';

export default function CoverPage({ url, editable, onChange }) {

    const supabase = createClientComponentClient();
    const [isUploading, setIsUploading] = useState(false)

    const [user, setUser] = useState(null)
    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        
        getUser();
    }, [])

    async function updateCover(ev) {
        const file = ev.target.files?.[0]
        if(file) {
            setIsUploading(true)
             await uploadUserProfilImage(
                supabase,
                user.id,
                file,
                'covers',
                'cover'
            )
            setIsUploading(false)

            if(onChange) onChange();
        }
    }

    return (
        <>
            <Image className={styles.imgCover} src={url} alt='Couverture' width={250} height={250} />
            {isUploading && (
                <div className={styles.containLoad}>
                    <div className={styles.load}>
                        <Preloader />
                    </div>
                </div>
            )}
            {editable && (
                <div className={styles.containBtn}>
                    <label className={styles.btn}>
                        <input type="file" hidden onChange={updateCover} />
                        <BsFillCameraFill className={styles.coverIcon} />
                        <p>Changer la photo de couverture</p>
                    </label>
                </div>
            )}
        </>
    )
}
