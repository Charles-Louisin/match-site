'use client'

import React, { useContext, useEffect, useState } from 'react'
import styles from './CreatePost.module.css'
import Link from 'next/link'
import Image from 'next/image'
import Avatar from '../Avatar/Avatar'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { UserContext } from '../Context/UserContext'
import { IoImageOutline } from "react-icons/io5";
import Preloader from '../Preloader/Preloader'
import { FaUserTag } from "react-icons/fa";
import { FaShare } from "react-icons/fa6";
import { FaImages } from "react-icons/fa";


export default function CreatePost({ onPost }) {

    const [content, setContent] = useState('')
    const [user, setUser] = useState(null)
    const supabase = createClientComponentClient();
    const { profile } = useContext(UserContext);
    const [uploads, setUploads] = useState([])
    const [isUploading, setIsUploading] = useState(false)


    useEffect(() => {
        async function getUser() {
            const { data: user } = await supabase.auth.getUser()
            setUser(user)
        }

        getUser();

    }, [])

    function createPost() {
        supabase.from('posts')
            .insert({
                author: user.user.id,
                content,
                photos: uploads,
            })
            .then(response => {
                if (!response.error) {
                    setContent('');
                    setUploads([])
                    if (onPost) {
                        onPost();
                    }
                }
            })
    }

    async function addPhotos(ev) {
        const files = ev.target.files;
        if (files.length > 0) {
            setIsUploading(true)
            for (const file of files) {
                const newName = Date.now() + file.name;
                const result = await supabase
                    .storage
                    .from('photos')
                    .upload(newName, file)
                if (result.data) {
                    const url = process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/photos/' + result.data.path;
                    setUploads(prevUploads => [...prevUploads, url]);

                } else {
                    // console.log(result);
                }
            }
            setIsUploading(false)
        }
    }



    return (
        <div className={styles.addPost}>
            {profile && (
                <>
                    <div className={styles.partPostUp}>
                        <div className={styles.inputPost}>
                            <Avatar url={profile?.avatar} />
                            <input
                                className={styles.postInput}
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                placeholder={`Quoi de neuf, ${profile?.name} ?`}
                            />
                        </div>
                        {isUploading && (
                            <div>
                                <Preloader />
                            </div>
                        )}
                        {uploads.length > 0 && (

                            <div className={styles.addPhoto}>
                                {uploads.map(upload => (
                                    <Image src={upload} alt="Image" key={''} width={100} height={100} className={styles.photoAjoute} />
                                ))}
                            </div>
                        )}
                    </div>
                    <div className={styles.partPostDown}>
                        <div className={styles.partLeft}>
                            <label className={styles.postLink}>
                                <input type="file" hidden multiple onChange={addPhotos} />
                                <FaImages className={styles.icons}/>
                                Image
                            </label>
                            <Link href={''} className={styles.postLink}>
                                <FaUserTag className={styles.icons}/>
                                Taguer un ami
                            </Link>
                            <Link href={''} className={styles.postLink}>
                                <FaShare className={styles.icons}/>
                                Partager
                            </Link>
                        </div>
                        <button onClick={createPost} className={styles.partager}>Publier</button>
                    </div>
                </>
            )}
        </div>
    )
}
