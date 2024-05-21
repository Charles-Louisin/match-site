'use client'

import React, { useEffect, useState } from 'react'
import styles from './NavMenu.module.css'
import Avatar from '../Avatar/Avatar'
import { LiaUserFriendsSolid } from 'react-icons/lia'
import { GrGallery, GrGroup, GrMoney } from 'react-icons/gr'
import { HiOutlineBuildingStorefront } from 'react-icons/hi2'
import { BsCalendar4Event, BsCameraReels, BsCameraVideo } from 'react-icons/bs'
import { GoHistory } from 'react-icons/go'
import { IoGameControllerOutline } from 'react-icons/io5'
import { RiMessage3Line } from 'react-icons/ri'
import { SiGoogleclassroom } from 'react-icons/si'
import { PiShoppingBagOpenDuotone } from 'react-icons/pi'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Navbar from '../Navbar/Navbar'
import { UserContextProvider } from '../Context/UserContext'

export default function NavMenu() {


    const supabase = createClientComponentClient();
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)


    useEffect(() => {
        async function getUser() {
            const { data: user } = await supabase.auth.getUser()
            setUser(user)
            // console.log(user.user.id);

            supabase.from('profiles')
                .select()
                .eq('id', user?.user?.id)
                .then(result => {
                    if (result?.data?.length) {
                        setProfile(result.data[0])

                    }
                })
        }

        getUser();

    }, [])

    return (
        <UserContextProvider>
        <Navbar />
        <div className={styles.asideLeft}>
            <div><Link className={styles.firstNavLinks} href={'/profil/' + profile?.id + '/?query=post'}>
                <Avatar url={profile?.avatar} />
                <p>{profile?.name}</p>
            </Link>
            </div>
            <div><Link className={styles.firstNavLinks} href={''}><LiaUserFriendsSolid className={styles.navIcons} />Amis</Link></div>
            <div><Link className={styles.firstNavLinks} href={''}><GrGroup className={styles.navIcons} />Groupes</Link></div>
            <div><Link className={styles.firstNavLinks} href={''}><HiOutlineBuildingStorefront className={styles.navIcons} />Marche</Link></div>
            <div><Link className={styles.firstNavLinks} href={''}><BsCameraReels className={styles.navIcons} />Reels</Link></div>
            <div><Link className={styles.firstNavLinks} href={''}><GoHistory className={styles.navIcons} />Souvenirs</Link></div>

            <div><Link className={styles.firstNavLinks} href={''}><BsCalendar4Event className={styles.navIcons} />Evenements</Link></div>
            <div><Link className={styles.firstNavLinks} href={''}><IoGameControllerOutline className={styles.navIcons} />Jeux</Link></div>
            <div><Link className={styles.firstNavLinks} href={''}><GrGallery className={styles.navIcons} />Gallery</Link></div>
            <div><Link className={styles.firstNavLinks} href={''}><BsCameraVideo className={styles.navIcons} />Videos</Link></div>
            <div><Link className={styles.firstNavLinks} href={''}><RiMessage3Line className={styles.navIcons} />Messages</Link></div>

            <div><Link className={styles.firstNavLinks} href={''}><GrMoney className={styles.navIcons} />Fonds</Link></div>
            <div><Link className={styles.firstNavLinks} href={''}><SiGoogleclassroom className={styles.navIcons} />Tutoriels</Link></div>
            <div><Link className={styles.firstNavLinks} href={''}><PiShoppingBagOpenDuotone className={styles.navIcons} />Courses</Link></div>

        </div>
        </UserContextProvider>
    )
}
