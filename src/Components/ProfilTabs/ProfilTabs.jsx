'use client'

import React, { useState } from 'react'
import styles from './ProfilTabs.module.css'
import { FaRegFileAlt } from "react-icons/fa";
import { IoIosInformationCircleOutline } from "react-icons/io"
import { LiaUserFriendsSolid } from "react-icons/lia";
import { IoImageOutline } from "react-icons/io5";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { CiSaveDown2 } from 'react-icons/ci';

export default function ProfilTabs({ userId, active }) {



    const label = styles.selectTabs;
    const noLabel = styles.labelTabs;
    // console.log(params);
    // const yes = params.entries();
    // console.log(yes);


    return (
        <div className={styles.main}>
            <div>
                <Link href={`/profil/${userId}?query=post`} className={active === 'post' ? label : noLabel} >
                    <div className={styles.containTabs}>
                        <FaRegFileAlt className={styles.iconTabs} />
                        Publications
                    </div>
                </Link>
            </div>

            <div>
                <Link href={`/profil/${userId}?query=about`} className={active === 'about' ? label : noLabel}>
                    <div className={styles.containTabs}>
                        <IoIosInformationCircleOutline className={styles.iconTabs} />
                        A Propos
                    </div>
                </Link>
            </div>

            <div>
                <Link href={`/profil/${userId}?query=photos`} className={active === 'photos' ? label : noLabel}>
                    <div className={styles.containTabs}>
                        <IoImageOutline className={styles.iconTabs} />
                        Photos
                    </div>
                </Link>
            </div>
        </div>
    )
}
