import React, { useContext } from 'react'
import styles from './Avatar.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { UserContext } from '../Context/UserContext'

export default function Avatar({ url }) {
  // const {profile} = useContext(UserContext)
  // const userId = profile?.id
  // console.log(profile);
  return (
    
      <Image className={styles.photo} src={url} width={35} height={35} alt='PP' />
      
  )
}