'use client'

import React from 'react'
import styles from './HomePage.module.css'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../../app/loading/page";
import Login from "../../app/login/page";
import Link from "next/link";
import PostCreated from "@/Components/PostCreated/PostCreated";
import CreatePost from "@/Components/CreatePost/CreatePost";
import CardStory from "@/Components/CardStory/CardStory";
import Navbar from "@/Components/Navbar/Navbar";
import Avatar from "@/Components/Avatar/Avatar";
import { UserContext } from "../Context/UserContext";
import Layout from "@/Components/layout";
import NavMenu from '../NavMenu/NavMenu';

export default function HomePage() {

    const router = useRouter()
    const supabase = createClientComponentClient();
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [posts, setPosts] = useState([])
    const [profile, setProfile] = useState(null)
    const [allUsers, setAllUsers] = useState([])

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
    // console.log(profile);

    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            setLoading(false)
            // console.log(user);

            fetchPosts();
            fetchUsers()
        }

        getUser();
    }, [])

    function fetchPosts() {
        supabase.from('posts')
            .select('id, content, created_at, photos, profiles(id, avatar, name)')
            .is('parent', null)
            .order("created_at", { ascending: false })
            .then(result => {
                setPosts(result.data)
            })
    }

    function fetchUsers() {
        supabase.from('profiles')
            .select('id, name, avatar')
            .then(result => {
                setAllUsers(result.data)
            })
    }

    // console.log(profile);

    if (loading) {
        return <Loading />
    }
    if (!user) {
        return <Login />
    }


    return (
        <main className="relative">
            <>
                <UserContext.Provider value={{ profile }}>
                    <Navbar />
                    <div className={styles.homeMain}>

                        {/* ASIDE LEFT */}
                        <div className={styles.hideNavMenu}>
                        <NavMenu  />
                        </div>

                        {/* MAIN */}
                        <div className={styles.mainCenter}>
                            <CardStory />

                            <CreatePost onPost={fetchPosts} />
                            {posts?.length > 0 && posts.map(post => (
                                <PostCreated key={post.id} {...post} />
                            ))}

                        </div>

                        {/* ASIDE RIGHT */}
                        <section className={styles.asideRight}>

                            {/* TODO: POUR LES SUGGESTIONS D'AMIS */}
                            <div className={styles.suggestionBox}>
                                <p className={styles.suggestionTitle}>Utilisateurs recents</p>

                                {allUsers.length > 0 && allUsers.map(allUser => (
                                    <>
                                        <div className={styles.suggestionCart}>
                                            <div className={styles.followOrNot}>
                                                <div className={styles.imgSuggestion}>
                                                    <Link href={''} className={styles.imgLink}>
                                                        <Avatar url={allUser?.avatar} />
                                                    </Link>
                                                    <p className={styles.contactName}>{allUser?.name}</p>
                                                </div>
                                                <Link href={'/profil/' + allUser?.id + '/?query=post'} className={styles.followBtn} type="button">Voir le profil</Link>
                                            </div>
                                        </div>
                                    </>
                                ))}
                            </div>
                        </section>

                    </div >
                </UserContext.Provider>
            </>
        </main>
    )
}
