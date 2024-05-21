import React from 'react'
import styles from './CardStory.module.css'
import Image from 'next/image'

export default function CardStory() {
    return (
        <div className={styles.storyBox}>
            <div className={styles.storyCart}>
                <Image className={styles.imgStory} src="/MATCHLogo.PNG" width={100} height={100} alt="" />
                <p className={styles.addStory}>+</p>
                <p className={styles.contactStoryName}>Charles</p>
            </div>
            <div className={styles.storyCart}>
                <Image className={styles.imgStory} src="/MATCHLogo.PNG" width={100} height={100} alt="" />
                <p className={styles.contactStoryName}>Ton Piment Sucre</p>
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
            </div>
        </div>
    )
}
