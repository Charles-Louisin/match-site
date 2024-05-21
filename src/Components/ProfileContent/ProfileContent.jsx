import React, { useEffect, useState } from 'react'
import styles from './ProfileContent.module.css'
import CreatePost from '../CreatePost/CreatePost'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import PostCreated from '../PostCreated/PostCreated'
import Layout from '../layout'
import { UserContext, UserContextProvider } from '../Context/UserContext'
import { FaPenToSquare } from 'react-icons/fa6'
import { FaRegSave } from 'react-icons/fa'
import { TbPencilCancel } from 'react-icons/tb'
import { FaLocationDot } from "react-icons/fa6";
import { GoHeartFill } from "react-icons/go";
import { BsCalendar3EventFill } from "react-icons/bs";

export default function ProfileContent({ active, userId }) {

    const [posts, setPosts] = useState([])
    const [profile, setProfile] = useState(null)
    const supabase = createClientComponentClient()
    const [savePosts, setSavePosts] = useState([])
    const [user, setUser] = useState(null)
    const [editMode, setEditMode] = useState(false)
    const [bio, setBio] = useState('')
    const [location, setLocation] = useState('')
    const [situation, setSituation] = useState('')
    const [sex, setSex] = useState('')

    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }

        getUser();
    }, [])
    const isMyUser = userId === user?.id

    useEffect(() => {
        if (!user?.id) {
            return;
        }

        supabase.from('saved_posts')
            .select('post_id')
            .eq('user_id', user?.id)
            .then(result => {
                const postIds = result.data.map(item => item.post_id)
                console.log(postIds);
                supabase.from('posts')
                    .select('*, profiles(*)')
                    .in('id', postIds)
                    .then(result => setPosts(result.data))
            })
    }, [])


    useEffect(() => {
        if (!userId) {
            return;
        }

        if (active === 'post') {
            loadPosts().then(() => { })
        }
    }, [userId])

    async function loadPosts() {
        const posts = await userPosts(userId)
        const profile = await userProfile(userId)
        setPosts(posts);
        setProfile(profile);
    }

    async function userPosts(userId) {
        const { data } = await supabase.from('posts')
            .select('id, content, created_at, author, photos')
            .is('parent', null)
            .order("created_at", { ascending: false })
            .eq('author', userId)
        return data;
    }
    async function userProfile(userId) {
        const { data } = await supabase.from('profiles')
            .select()
            .eq('id', userId)
        return data?.[0];
    }

    function saveProfile() {
        supabase.from('profiles')
            .update({
                bio,
                location,
                situation,
                sex,
            })
            .eq('id', user.id)
            .then(result => {
                if (!result.error) {
                    setProfile(prev => ({ ...prev, bio, location, situation, sex }))
                }
                setEditMode(false)
            })
    }

    return (
        <div className={styles.main}>
            {active === 'post' && (
                <div className={styles.containPost}>
                    <div className={styles.postLeft}>
                        <div className={styles.containLeft}>
                            <div className={styles.profilName}>
                                {editMode && (
                                    <div className={styles.editMode}>
                                        <textarea type="text"
                                            className={styles.areaNameMode}
                                            placeholder='Parlez nous de vous'
                                            value={bio}
                                            onChange={e => setBio(e.target.value)}
                                        />

                                        <input type="text"
                                            className={styles.inputNameMode}
                                            placeholder='Lieu de naissance'
                                            value={location}
                                            onChange={e => setLocation(e.target.value)}
                                        />

                                        <input type="text"
                                            className={styles.inputNameMode}
                                            placeholder='Celibataire ou marie'
                                            value={situation}
                                            onChange={e => setSituation(e.target.value)}
                                        />

                                        <input type="text"
                                            className={styles.inputNameMode}
                                            placeholder='Date de naissance'
                                            value={sex}
                                            onChange={e => setSex(e.target.value)}
                                        />
                                    </div>

                                )}
                                {!editMode && (
                                    <div className={styles.containText}>
                                        {profile?.bio && (
                                            <p className={styles.bio}>{profile?.bio} <br/>
                                            {isMyUser && (
                                                <button onClick={() => {
                                                    setEditMode(true);
                                                    setBio(profile.bio);
                                                }}
                                                    className={styles.infoBtn}
                                                    type="button">
                                                    <FaPenToSquare className={styles.icons} />
                                                    Modifier ma bio
                                                </button>
                                            )}
                                            </p>
                                        )}
                                        {!profile?.bio && (
                                            <p className={styles.bio}>
                                                Aucune bio definie <br />
                                                {isMyUser && (
                                                    <button onClick={() => {
                                                        setEditMode(true);
                                                        setBio(profile.bio);
                                                    }}
                                                        className={styles.infoBtn}
                                                        type="button">
                                                        <FaPenToSquare className={styles.icons} />
                                                        Modifier ma bio
                                                    </button>
                                                )}
                                                </p>
                                        )}

                                        {/* location */}

                                        {profile?.location && (
                                            <p className={styles.textEdited}><FaLocationDot className={styles.iconEdit} /> De <strong>{profile?.location}</strong></p>
                                        )}
                                        {!profile?.location && (
                                            <p className={styles.textEdited}><FaLocationDot className={styles.iconEdit} />
                                                Aucune location definie  </p>
                                        )}

                                        {/* situation */}

                                        {profile?.situation && (
                                            <p className={styles.textEdited}><GoHeartFill className={styles.iconEdit} />{profile?.situation}</p>
                                        )}
                                        {!profile?.situation && (
                                            <p className={styles.textEdited}><GoHeartFill className={styles.iconEdit} />
                                                Aucune situation definie</p>
                                        )}

                                        {/* sex */}

                                        {profile?.sex && (
                                            <p className={styles.textEdited}><BsCalendar3EventFill className={styles.iconEdit} />{profile?.sex}</p>
                                        )}
                                        {!profile?.sex && (
                                            <p className={styles.textEdited}><BsCalendar3EventFill className={styles.iconEdit} />
                                                Aucune date definie</p>
                                        )}
                                    </div>
                                )}

                                {isMyUser && !editMode && (
                                    <button onClick={() => {
                                        setEditMode(true);
                                        setBio(profile.bio);
                                        setLocation(profile.location);
                                        setSituation(profile.situation);
                                        setSex(profile.sex);
                                    }}
                                        className={styles.infoBtn}
                                        type="button">
                                        <FaPenToSquare className={styles.icons} />
                                        Modifier mes infos
                                    </button>
                                )}
                                {isMyUser && editMode && (
                                    <div className={styles.editableBtn}>
                                        <button onClick={saveProfile} className={`${styles.infoBtn} ${styles.saveBtn}`} type="button">
                                            <FaRegSave className={styles.icons} />
                                            Enregistrer
                                        </button>
                                        <button onClick={() => setEditMode(false)} className={`${styles.infoBtn} ${styles.cancelBtn}`} type="button">
                                            <TbPencilCancel className={styles.icons} />
                                            Annuler
                                        </button>
                                    </div>

                                )}

                            </div>
                        </div>
                    </div>
                    <div className={styles.postRight}>
                        <CreatePost />
                        {posts?.length > 0 && posts.map(post => (
                            <PostCreated key={post.created_at} {...post} profiles={profile} />
                        ))}
                    </div>
                </div>
            )}

            {active === 'about' && (
                <div>about</div>
            )}

            {active === 'photos' && (
                <div>photo</div>
            )}
        </div>
    )
}
