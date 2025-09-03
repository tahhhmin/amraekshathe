import React from 'react'
import Styles from './Header.module.css'
import Link from 'next/link'
import AuthButton from '../custom-buttons/AuthButton'

export default function Header() {
    return (
        <header className={Styles.header}>
            <div className={Styles.logoContainer}>
                <p>Amra Eksahthe</p>
            </div>

            <div className={Styles.navContainer}>
                <Link href='/projects'>
                    <p>Projects</p>
                </Link>

                <Link href='/organizations'>
                    <p>Organizations</p>
                </Link>

                <Link href='/volunteers'>
                    <p>Volunteers</p>
                </Link>
            </div>

            <div className={Styles.buttonContainer}>
                <AuthButton />
            </div>
        </header>   
    )
}