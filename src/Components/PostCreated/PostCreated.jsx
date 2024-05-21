'use client'

import React, { useContext, useEffect, useState } from 'react'
import styles from './PostCreated.module.css'
import Link from 'next/link'
import Avatar from '../Avatar/Avatar'
import Image from 'next/image'
import ReactTimeAgo from 'react-time-ago'
import { useTimeAgo } from 'next-timeago'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { UserContext } from '../Context/UserContext'
import { LuHeart } from "react-icons/lu";
import { BsThreeDots } from "react-icons/bs";
import { BsShare } from "react-icons/bs";
import { BiMessageSquare } from "react-icons/bi";
import { CiSaveDown2 } from "react-icons/ci";
import { AiFillLike } from "react-icons/ai";

export default function PostCreated({ id, content, created_at, photos, profiles: authorProfile }) {

    const { TimeAgo } = useTimeAgo();
    const { profile: myProfile } = useContext(UserContext);
    const supabase = createClientComponentClient()
    const [likes, setLikes] = useState([])
    const [comments, setComments] = useState([])
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        fetchLikes();
        fetchComments();
    }, [])

    function fetchLikes() {
        supabase.from('likes')
            .select()
            .eq('post_id', id)
            .then(result => setLikes(result.data))
    }

    function fetchComments() {
        supabase.from('posts')
            .select('*, profiles(*)')
            .order("created_at", { ascending: false })
            .eq('parent', id)
            .then(result => setComments(result.data))
    }

    const isMyLike = !!likes.find(like => like.user_id === myProfile?.id);

    function ToggleLike() {
        if (isMyLike) {
            supabase.from('likes')
                .delete()
                .eq('post_id', id)
                .eq('user_id', myProfile.id)
                .then(() => {
                    fetchLikes();
                })
            return;
        }

        supabase.from('likes')
            .insert({
                post_id: id,
                user_id: myProfile.id,
            })
            .then(() => {
                fetchLikes();
            })
    }

    function postComment(ev) {
        ev.preventDefault();
        supabase.from('posts')
            .insert({
                content: commentText,
                author: myProfile.id,
                parent: id,
            })
            .then(result => {
                // console.log(result);
                fetchComments();
                setCommentText('');
                setHide(true)
            })
    }

    const [hide, setHide] = useState(false)
    const [show, setShow] = useState(false)

    // console.log(authorProfile.id);
    return (
        <div className={styles.ifPost}>
            <div className={styles.firstPartIfPost}>
                <div className={styles.imgAndName}>
                    <Avatar url={authorProfile?.avatar} />
                    <div className={styles.nameAndTime}>
                        <p className={styles.profilInfo}>
                            <Link className={styles.nameContact} href={'/profil/' + authorProfile?.id + '?query=post'}>{authorProfile?.name}</Link>

                            <small className={styles.small}>a partage une publication</small>
                        </p>
                        <p className={styles.datePost}>
                            <TimeAgo date={created_at} locale='fr' />
                        </p>
                    </div>
                </div>
                <div className={styles.pointMenu}>
                    <BsThreeDots className={styles.iconDelete} />
                </div>
            </div>


            <div className={styles.secondPartIfPost}>
                <p className={styles.textComment}>{content}</p>
            </div>
            {photos?.length > 0 && (
                <div className={styles.photoAjoute} >
                    {photos.map(photo => (
                        <div key={photo}>
                            <Image className={styles.imagePoste} src={photo} alt='image' width={250} height={250} />
                        </div>
                    ))}
                </div>
            )}

            <div className={styles.thirtPartIfPost}>
                <div className={styles.countLike}>
                    {isMyLike && (
                        <>
                            {likes.length === 1 && (
                                <div className={styles.likeContainer}>
                                    <span className={styles.likeNbr}><AiFillLike className={styles.fillLike} /></span>
                                    <p className={styles.likeText}>Vous avez like</p>
                                </div>
                            )}
                            {likes.length === 2 && (
                                <div className={styles.likeContainer}>
                                    <span className={styles.likeNbr}><AiFillLike className={styles.fillLike} /></span>
                                    <p className={styles.likeText}>Vous et {likes.length-1} autre personne</p>
                                </div>
                            )}
                            {likes.length > 2 && (
                                <div className={styles.likeContainer}>
                                    <span className={styles.likeNbr}><AiFillLike className={styles.fillLike} /></span>
                                    <p className={styles.likeText}>Vous et {likes.length-1} autres personnes</p>
                                </div>
                            )}
                        </>
                    )}
                    {!isMyLike && (
                        <>
                            {likes.length > 0 && (

                                <div className={styles.likeContainer}>
                                    <span className={styles.likeNbr}><AiFillLike className={styles.fillLike} /></span>
                                    <p className={styles.likeText}>{likes.length}</p>
                                </div>
                            )}

                            {likes.length === 0 && (
                                <div className={styles.likeContainer}>
                                    <span className={styles.likeNbr}><AiFillLike className={styles.fillLike} /></span>
                                    <p className={styles.likeText}>Soyez le premier a liker</p>
                                </div>
                            )}
                        </>

                    )}

                    {comments.length === 0 && (
                        <p className={styles.likeText}>Aucun commentaire</p>
                    )}
                    {comments.length === 1 && (
                        <p className={styles.likeText}>{comments.length} Commentaire</p>
                    )}
                    {comments.length > 1 && (
                        <p className={styles.likeText}>{comments.length} Commentaires</p>
                    )}
                </div>
                <div className={styles.partLike}>

                    <button onClick={ToggleLike} className={`${styles.postLink} ${isMyLike ? styles.postLinks : ''}`}>
                        <AiFillLike className={isMyLike ? styles.myLike : styles.postIcon} />
                        {`J'aime`}
                    </button>

                    <button onClick={() => setHide(!hide)} className={styles.postLink}>
                        <BiMessageSquare className={styles.postIcon} />
                        Commenter
                    </button>

                </div>
            </div>
            <div className={styles.lastPart}>
                {hide && (
                    <>
                        <div className={styles.commentaire}>
                            <Avatar url={myProfile?.avatar} />
                            <form className={styles.inputForm} onSubmit={postComment}>
                                <input
                                    value={commentText}
                                    onChange={e => setCommentText(e.target.value)}
                                    className={styles.inputComment} type="text" name="comment"
                                    placeholder='Laissez un commentaire'
                                />
                            </form>
                        </div>
                        {comments.length > 0 && comments.map(comment => (
                            <div key={''} className={styles.postComment}>
                                <Avatar url={comment.profiles.avatar} />
                                <div className={styles.myPost}>
                                    <div className={styles.myPostUp}>
                                        <p className={styles.nameContact}>
                                            <Link className={styles.linkId} href={'/profil/' + comment.profiles.id + '?query=post'}>
                                                {comment.profiles.name}
                                            </Link>
                                        </p>
                                        <p className={styles.timeAgo}>
                                            <TimeAgo date={comment.created_at} locale='fr' />
                                        </p>
                                    </div>
                                    <p className={styles.textComment}>
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    )
}
