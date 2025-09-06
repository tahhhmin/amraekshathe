import React from 'react'
import Styles from './HeroSection.module.css'
import Button from '@/components/common/button/Button'
import { HeartHandshake } from 'lucide-react'
import Link from 'next/link'

export default function HeroSection() {
    return (
        <div className={Styles.container}>
            <div className={Styles.titleImageContainer}>
                <div className={Styles.titleContainer}>

                    <div className={Styles.tag}>
                        <HeartHandshake className={Styles.icon}/>
                        <p>Amra Ekshathe</p>
                    </div>

                    <h1 className={Styles.title}>Connect Volunteers with Meaningful Cause</h1>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe placeat, ex nemo eius nostrum dolor quidem vel ad fuga impedit natus, in atque amet corrupti aliquam iure enim minus eum.</p>
                
                    <div className={Styles.buttonContainer}>
                        <Link href='/auth/signup/volunteer'>
                            <Button
                                variant='primary'
                                label='Signin As a Volunteer'
                                showIcon
                            />
                        </Link>
                        <Link href='/auth/signup/organization'>
                            <Button
                            variant='secondary'
                            label='Signin As a Volunteer'
                            showIcon
                            />
                        </Link>
                        
                    </div>
                </div>

                <div className={Styles.imageContainer}>

                </div>
            </div>

            <div className={Styles.infoContainer}>
                <h2 className={Styles.infoContainerTitle}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </h2>
                <div className={Styles.statContainerWrapper}>
                    <div className={Styles.statContainer}>
                        <h2 className={Styles.infoTitle}>510+</h2>
                        <p className={Styles.infoSubtitle}>Projects</p>
                    </div>

                    <div className={Styles.statContainer}>
                        <h2 className={Styles.infoTitle}>160+</h2>
                        <p className={Styles.infoSubtitle}>Organizations</p>
                    </div>

                    <div className={Styles.statContainer}>
                        <h2 className={Styles.infoTitle}>1600+</h2>
                        <p className={Styles.infoSubtitle}>Volunteers</p>
                    </div>
                </div>
            </div>
        </div>
    )
}