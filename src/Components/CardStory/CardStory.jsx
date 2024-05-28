import React, { useEffect, useState } from 'react'
import styles from './CardStory.module.css'
import Image from 'next/image'
import Link from 'next/link'
import Avatar from '../Avatar/Avatar'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { MdAdd } from "react-icons/md";

export default function CardStory() {

    const [allUsers, setAllUsers] = useState([])
    const [user, setUser] = useState(null)
    const supabase = createClientComponentClient()
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            // console.log(user);

            fetchUsers();

            supabase.from('profiles')
                .select()
                .eq('id', user?.id)
                .then(result => {
                    if (result?.data?.length) {
                        setProfile(result.data[0])

                    }
                })
        }

        getUser();
    }, [])

    function fetchUsers() {
        supabase.from('profiles')
            .select('id, name, avatar')
            .then(result => {
                setAllUsers(result.data)
            })
    }
    // console.log(user?.user);

    return (
        <div className={styles.storyBox}>
            {profile && (
                <div className={styles.headStoryCart}>
                    <div className={styles.myStoryCart}>
                        <Image className={styles.imgStory} src={profile?.avatar} width={100} height={100} alt="" />
                        <p><MdAdd className={styles.iconAdd} /></p>
                    </div>
                    <p className={styles.myContactStoryName}>Créer une story</p>
                </div>
            )}
            {allUsers.length > 0 && allUsers.map(allUser => (
                <>
                    <div className={styles.storyCart}>
                        <Image className={styles.imgStory} src={allUser?.avatar} width={100} height={100} alt="" />
                        <p className={styles.contactStoryName}>{allUser?.name}</p>
                    </div>
                </>
            ))}
            {/* <div className={styles.storyCart}>
                <Image className={styles.imgStory} src="/MATCHLogo.PNG" width={100} height={100} alt="" />
                <p className={styles.addStory}>+</p>
                <p className={styles.contactStoryName}>Charles</p>
            </div>

            <div className={styles.storyCart}>
                <Image className={styles.imgStory} src="/louisin.jpg" width={100} height={100} alt="" />
                <p className={styles.contactStoryName}>Dinasty Le Tiger</p>
            </div>
            <div className={styles.storyCart}>
                <Image className={styles.imgStory} src="/MATCHLogo.PNG" width={100} height={100} alt="" />
                <p className={styles.contactStoryName}>Match Logo</p>
            </div>
            <div className={styles.storyCart}>
                <Image className={styles.imgStory} src="/louisin.jpg" width={100} height={100} alt="" />
                <p className={styles.contactStoryName}>Drew Williamson</p>
            </div> */}
        </div>
    )
}
