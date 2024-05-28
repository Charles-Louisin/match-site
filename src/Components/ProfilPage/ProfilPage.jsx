'use client'

import React, { useContext, useEffect, useState } from 'react'
import styles from './ProfilePage.module.css'
import Navbar from '../../Components/Navbar/Navbar'
import CreatePost from '../../Components/CreatePost/CreatePost'
import PostCreated from '../../Components/PostCreated/PostCreated'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useParams, useRouter, usePathname, useSearchParams } from 'next/navigation'
import CoverPage from '../Cover/Cover'
import AvatarProfil from '../AvatarProfil/AvatarProfil'
import { FaPenToSquare } from "react-icons/fa6";
import { RiMessengerLine } from "react-icons/ri";
import { IoPersonAddOutline } from "react-icons/io5";
import { FaRegSave } from "react-icons/fa";
import { TbPencilCancel } from "react-icons/tb";
import ProfilTabs from '../ProfilTabs/ProfilTabs'
import ProfileContent from '../ProfileContent/ProfileContent'
import Layout from '../layout'
import { UserContext, UserContextProvider } from '../Context/UserContext'
import Image from 'next/image'
import Preloader from '../Preloader/Preloader'
import { BsCamera } from 'react-icons/bs'
import Loading from '@/app/loading/page'
import { uploadUserProfilImage } from '../../../helpers/user'


export default function Profil() {

    const supabase = createClientComponentClient();
    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false)
    const [name, setName] = useState('')
    const [place, setPlace] = useState('')
    const params = useParams()
    const userId = params.id;
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const SearchParams = useSearchParams()
    const tab = SearchParams.get('query')

    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            setLoading(false)
        }

        getUser();
    }, [])



    const isMyUser = userId === user?.id

    useEffect(() => {
        if (!userId) {
            return;
        }

        fetchUser();

    }, [userId])

    function fetchUser() {
        supabase.from('profiles')
            .select()
            .eq('id', userId)
            .then(result => {
                if (result.error) {
                    throw result.error;
                }
                if (result.data) {
                    setProfile(result.data[0])
                }
            })
    }

    function saveProfile() {
        supabase.from('profiles')
            .update({
                name,
                place,
            })
            .eq('id', user.id)
            .then(result => {
                if (!result.error) {
                    setProfile(prev => ({ ...prev, name, place }))
                }
                setEditMode(false)
            })
    }

    const [isUploading, setIsUploading] = useState(false)
    async function updateCover(ev) {
        const file = ev.target.files?.[0]
        if (file) {
            setIsUploading(true)
            await uploadUserProfilImage(
                supabase,
                user.id,
                file,
                'covers',
                'cover'
            )
            setIsUploading(false)

            if (onchange) onChange();
        }
    }

    if (loading) {
        return <Loading />
    }



    return (
        <Layout>
            <UserContextProvider>
                <Navbar />
                <div className={styles.main}>
                    <div className={styles.upProfil}>
                        <div className={styles.profilBody}>
                            <div className={styles.photoCouverture}>
                                {profile?.cover && (
                                    <CoverPage url={profile?.cover} editable={isMyUser} onChange={fetchUser} />
                                )}
                                {!profile?.cover && (
                                    <>
                                        <CoverPage url={'/hide-facebook-profile-picture-notification.jpg'} />
                                        {isUploading && (
                                            <div className={styles.containLoad}>
                                                <div className={styles.load}>
                                                    <Preloader />
                                                </div>
                                            </div>
                                        )}
                                        {isMyUser && (
                                            <div className={styles.containBtn}>
                                                <label className={styles.btn}>
                                                    <input type="file" hidden onChange={updateCover} />
                                                    <BsCamera className={styles.coverIcon} />
                                                    Ajoutez une photo de couverture
                                                </label>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className={styles.BoxInfoProfil}>
                                <div className={styles.photoProfil}>
                                    <div className={styles.avatarFixed}>
                                    {profile && (
                                        <AvatarProfil url={profile?.avatar} editable={isMyUser} onChange={fetchUser} />
                                    )}
                                    {!profile && (
                                        <AvatarProfil url={'/hide-facebook-profile-picture-notification.jpg'} editable={isMyUser} onChange={fetchUser} />
                                    )}
                                    </div>
                                    
                                    <div className={styles.profilName}>
                                        {editMode && (
                                            <div className={styles.editMode}>
                                                <input type="text"
                                                    className={styles.inputNameMode}
                                                    placeholder='Entrez votre nom'
                                                    value={name}
                                                    onChange={e => setName(e.target.value)}
                                                />

                                                <input type="text"
                                                    className={styles.inputNameMode}
                                                    placeholder='Lieu de residence'
                                                    value={place}
                                                    onChange={e => setPlace(e.target.value)}
                                                />
                                            </div>

                                        )}
                                        {!editMode && (
                                            <div className={styles.align}>
                                                <p>{profile?.name}</p>
                                                {profile?.place && (
                                                    <p className={styles.ville}>{profile?.place}</p>
                                                )}
                                                {!profile?.place && (
                                                    <p className={styles.ville}>Aucune location definie</p>
                                                )}
                                            </div>
                                        )}

                                    </div>
                                </div>

                                <div className={styles.otherBtn}>
                                    {isMyUser && !editMode && (
                                        <button onClick={() => {
                                            setEditMode(true);
                                            setName(profile.name);
                                            setPlace(profile.place);
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
                                    {!isMyUser && (
                                        <>
                                            <button className={styles.ajouter} type="button">
                                                <IoPersonAddOutline className={styles.icons} />
                                                Ajouter
                                            </button>
                                            <button className={styles.msgBtn} type="button">
                                                <RiMessengerLine className={styles.icons} />
                                                Message
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <ProfilTabs active={tab} userId={profile?.id} />
                        </div>

                        <div className={styles.addComponents}>
                            <ProfileContent userId={userId} active={tab} />
                        </div>
                    </div>

                </div>
            </UserContextProvider>
        </Layout>
    )
}
