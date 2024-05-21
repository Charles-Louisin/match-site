'use client'

import React, { useContext, useEffect, useState } from 'react'
import styles from './Navbar.module.css'
import Link from 'next/link'
import Image from 'next/image'
import Avatar from '../Avatar/Avatar'
import { UserContext } from '../Context/UserContext'
import { useTheme } from "next-themes";
import { useSearchParams, useRouter } from 'next/navigation'
import ToggleTheme from '../ToggleTheme/ToggleTheme'
import { GrHomeRounded } from "react-icons/gr";
import { MdGroupAdd, MdOutlineGroupAdd } from "react-icons/md";
import { BsBell } from "react-icons/bs";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { CiSearch } from "react-icons/ci";
import { MdOutlineApps } from "react-icons/md";
import { BsArrowLeft } from "react-icons/bs";
import { SlLogout } from 'react-icons/sl'
import { IoLogOutSharp } from "react-icons/io5";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Loading from '@/app/loading/page'
import Login from '@/app/login/page'
import { GrMenu } from "react-icons/gr";

export default function Navbar() {



  const { profile } = useContext(UserContext)
  const [show, setShow] = useState(false)
  const [hide, setHide] = useState(false)

  const router = useRouter()
  const supabase = createClientComponentClient();
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      // console.log(user);
    }

    getUser();
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    setUser(null)
  }


  return (
    <div className={styles.mainNav}>
      <div className={styles.left}>
        <Link href={`/`}><Image className={styles.logo} src='/realMatch.png' width={50} height={50} alt="logo" /></Link>
        <CiSearch onClick={() => setShow(!show)} className={styles.iconSearch} />
        <input className={styles.input} onClick={() => setShow(!show)} type="search" placeholder='Rechercher dans Match...' />

          <div className={styles.navMenu2}>
          <Link href={`/menu`} className={styles.navLink} >
            <span className={styles.spanHome}>
              <GrMenu className={styles.iconsLink} />
              <p className={styles.menu}>Menu</p>
            </span>
          </Link>
        </div>

      </div>
      {show && (
        <>
          <div onClick={() => setShow(!show)} className={styles.mainContain}>
          </div>
          <div className={styles.containSearchBar}>
            <div className={styles.searchBar}>
              <BsArrowLeft onClick={() => setShow(!show)} className={styles.arrowIcon} />
              <input className={styles.inputMain} type="search" placeholder='Rechercher dans Match...' />
              <CiSearch className={styles.iconSearchMain} />
            </div>
            <div className={styles.result}></div>
          </div>
        </>
      )}


      <div className={styles.center}>
        <Link href={`/`} className={styles.navLink} >
          <span className={styles.spanHome}>
            <GrHomeRounded className={styles.iconsLink} />
            <p className={styles.accueil}>Acceuil</p>
          </span>
        </Link>


        <Link href={`/`} className={styles.navLink} >
          <span className={styles.spanHome}>
            <MdOutlineGroupAdd className={styles.iconsLink} />
            <p className={styles.invitation}>Invitations</p>
          </span>
        </Link>


        <Link href={`/`} className={styles.navLink} >
          <span className={styles.spanHome}>
            <BsBell className={styles.iconsLink} />
            <p className={styles.notif}>Notifications</p>
          </span>
        </Link>


        <Link href={`/`} className={styles.navLink} >
          <span className={styles.spanHome}>
            <HiOutlineUserGroup className={styles.iconsLink} />
            <p className={styles.discussion}>Discussions</p>
          </span>
        </Link>

        <div className={styles.navMenu}>
          <Link href={`/menu`} className={styles.navLink} >
            <span className={styles.mainNav}>
              <GrMenu className={styles.iconsLink} />
              <p className={styles.menu}>Menu</p>
            </span>
          </Link>
        </div>
      </div>



      <div className={styles.right}>
        <div className={styles.menuIcon}>
          <span className={styles.apps}>
            <MdOutlineApps className={styles.iconsLink} />
          </span>
          <p className={styles.appText}>Menu</p>
        </div>
        <ToggleTheme />
        <div onClick={() => setHide(!hide)} className={styles.imgProfil}>
          {profile?.avatar && (
            <div className={styles.container}>
              <Avatar url={profile?.avatar} />
              <span className={styles.avatarText}>Compte</span>
            </div>
          )}
          {!profile?.avatar && (
            <Avatar url={'/hide-facebook-profile-picture-notification.jpg'} />
          )}
        </div>
      </div>
      {hide && (
        <>
          <div onClick={() => setHide(!hide)} className={styles.mainContain}>
          </div>
          <div className={styles.containAccount}>
            <div className={styles.containerAccount}>
              <Link className={styles.profilAccount} href={'/profil/' + profile?.id + '/?query=post'}>
                <Avatar url={profile?.avatar} />
                <p>{profile?.name}</p>
              </Link>
            </div>
            <div className={styles.logout}>
              <button onClick={handleSignOut} className={styles.firstNavLinks}><IoLogOutSharp className={styles.navIcons} />Deconnexion</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

