import React from 'react'
import Styles from './HeroSection.module.css'
import Button from '../common/button/Button'

export default function HeroSection() {
    return (
        <div className={Styles.container}>
            
            <div className={Styles.tag}>
               <p>An Initiative by</p>
            </div>

            <div className={Styles.titleContainer}>
                <h1 className={Styles.heroText}>Connect Volunteers with</h1>
                <h1 className={`${Styles.heroText} ${Styles.title}`}>Meaningful Causes</h1>
            </div>


            <div className={Styles.userContainerWrapper}>
                <div className={Styles.userContainer}>
                    <h2>Volunteer?</h2>
                    <p>
                        Lorem ipsum, dolor sit amet consectetur adipisicing 
                        elit.
                    </p>
                    <Button
                        variant='primary'
                        label='Get Started'
                        showIcon
                    />
                </div>

                <div className={Styles.userContainer}>
                    <h2>Organization?</h2>
                    <p>
                        Lorem ipsum, dolor sit amet consectetur adipisicing 
                        elit.
                    </p>
                    <Button
                        variant='primary'
                        label='Get Started'
                        showIcon
                    />
                </div>
            </div>
        </div>
    )
}