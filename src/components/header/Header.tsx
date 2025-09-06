import React from 'react'
import Styles from './Header.module.css'
import Link from 'next/link'
import HeaderAuthButton from '@/components/custom-buttons/HeaderAuthButton'

import Logo from '../../../public/logo.svg'

import Image from 'next/image'
import ThemeToggleButton from '../custom-buttons/ThemeButton'

export default function Header() {
    return (
        <header className={Styles.header}>
            <div className={Styles.logoContainer}>
                <Link href="/" className={Styles.logoLink}>
                    <Image 
                        className={Styles.logo}
                        src={Logo} 
                        alt="Site Logo" 
                        width={135}  
                        priority 
                    />
                </Link>
            </div>

            <div className={Styles.navItemContainer}>
                <Link href='/' className={Styles.link}>
                    <p>Home</p>
                </Link>
            </div>

            <div className={Styles.navItemContainer}>
                <Link href='about-us' className={Styles.link}>
                    <p>About Us</p>
                </Link>
            </div>
            
            <div className={Styles.navItemContainer}>
                <Link href='/projects' className={Styles.link}>
                    <p>Projects</p>
                </Link>
            </div>

            <div className={Styles.navItemContainer}>
                <Link href='/organizations' className={Styles.link}>
                    <p>Organizations</p>
                </Link>
            </div>

            <div className={Styles.navItemContainer}>
                <Link href='/contact-us' className={Styles.link}>
                    <p>Contact Us</p>
                </Link>
            </div>

            <div className={`${Styles.buttonContainer} ${Styles.active}`}>
                <ThemeToggleButton />
            </div>
            <div className={`${Styles.buttonContainer} ${Styles.authButton}`}>
                <HeaderAuthButton />
            </div>
            <div className={`${Styles.buttonContainer} ${Styles.active}`}>
                <ThemeToggleButton />
            </div>
        </header>   
    )
}