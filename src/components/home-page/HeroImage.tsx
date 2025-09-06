'use client'
import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Styles from './HeroImage.module.css'

export default function HeroImage() {
    const containerRef = useRef<HTMLDivElement>(null)
    const scrollWrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (scrollWrapperRef.current) {
                // Create seamless infinite scroll
                const scrollHeight = scrollWrapperRef.current.scrollHeight / 2 // Half because we duplicate content

                gsap.set(scrollWrapperRef.current, {
                    y: 0
                })

                // Create infinite scroll animation
                gsap.to(scrollWrapperRef.current, {
                    y: -scrollHeight,
                    duration: 15, // Adjust speed here (lower = faster)
                    ease: "none",
                    repeat: -1,
                    repeatDelay: 0
                })
            }
        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <div className={Styles.container} ref={containerRef}>
            <div className={Styles.scrollWrapper} ref={scrollWrapperRef}>
                {/* First set of images */}
                <div className={Styles.image1}></div>
                <div className={Styles.image2}></div>
                <div className={Styles.image3}></div>
                <div className={Styles.image4}></div>
                <div className={Styles.image5}></div>
                
                {/* Duplicate set for seamless loop */}
                <div className={Styles.image1}></div>
                <div className={Styles.image2}></div>
                <div className={Styles.image3}></div>
                <div className={Styles.image4}></div>
                <div className={Styles.image5}></div>
            </div>
        </div>  
    )   
}