'use client'
import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Styles from './HeroSection.module.css'
import Button from '@/components/common/button/Button'
import { HeartHandshake } from 'lucide-react'
import Link from 'next/link'
import HeroImage from './HeroImage'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null)
    const tagRef = useRef<HTMLDivElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)
    const paragraphRef = useRef<HTMLParagraphElement>(null)
    const buttonsRef = useRef<HTMLDivElement>(null)
    const imageRef = useRef<HTMLDivElement>(null)
    const infoTitleRef = useRef<HTMLHeadingElement>(null)
    const statsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Create timeline for initial animations
            const tl = gsap.timeline()

            // Animate tag with scale and fade
            if (tagRef.current) {
                tl.fromTo(tagRef.current, {
                    opacity: 0,
                    scale: 0.8,
                    y: 20
                }, {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "back.out(1.7)"
                })
            }

            // Animate title with stagger effect
            if (titleRef.current) {
                tl.fromTo(titleRef.current, {
                    opacity: 0,
                    y: 30
                }, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out"
                }, "-=0.3")
            }

            // Animate paragraph
            if (paragraphRef.current) {
                tl.fromTo(paragraphRef.current, {
                    opacity: 0,
                    y: 20
                }, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "power2.out"
                }, "-=0.4")
            }

            // Animate buttons with stagger
            if (buttonsRef.current) {
                tl.fromTo(buttonsRef.current.children, {
                    opacity: 0,
                    y: 20,
                    scale: 0.9
                }, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: "back.out(1.7)"
                }, "-=0.3")
            }

            // Animate image container
            if (imageRef.current) {
                tl.fromTo(imageRef.current, {
                    opacity: 0,
                    x: 50,
                    scale: 0.9
                }, {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: "power2.out"
                }, "-=0.6")
            }

            // Animate info section with ScrollTrigger
            if (infoTitleRef.current) {
                gsap.fromTo(infoTitleRef.current, {
                    opacity: 0,
                    y: 30
                }, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: infoTitleRef.current,
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play none none reverse"
                    }
                })
            }

            // Animate stats with stagger and counter effect
            if (statsRef.current) {
                gsap.fromTo(statsRef.current.children, {
                    opacity: 0,
                    y: 30,
                    scale: 0.8
                }, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.2,
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: statsRef.current,
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play none none reverse"
                    }
                })
            }

            // Add floating animation to the image container
            if (imageRef.current) {
                gsap.to(imageRef.current, {
                    y: -10,
                    duration: 2,
                    repeat: -1,
                    yoyo: true,
                    ease: "power2.inOut",
                    delay: 1
                })
            }

            // Add subtle scale animation on button hover
            if (buttonsRef.current) {
                const buttons = buttonsRef.current.querySelectorAll('a')
                buttons.forEach((button: Element) => {
                    button.addEventListener('mouseenter', () => {
                        gsap.to(button, {
                            scale: 1.05,
                            duration: 0.3,
                            ease: "power2.out"
                        })
                    })
                    
                    button.addEventListener('mouseleave', () => {
                        gsap.to(button, {
                            scale: 1,
                            duration: 0.3,
                            ease: "power2.out"
                        })
                    })
                })
            }

            // Add counter animation for stats
            if (statsRef.current) {
                const statNumbers = statsRef.current.querySelectorAll(`.${Styles.infoTitle}`)
                statNumbers.forEach((stat: Element, index: number) => {
                    const element = stat as HTMLElement
                    const finalValue = parseInt(element.textContent || '0')
                    const counter = { value: 0 }
                    
                    gsap.to(counter, {
                        value: finalValue,
                        duration: 2,
                        ease: "power2.out",
                        delay: index * 0.2 + 0.5,
                        onUpdate: () => {
                            element.textContent = Math.round(counter.value) + "+"
                        },
                        scrollTrigger: {
                            trigger: stat,
                            start: "top 80%",
                            toggleActions: "play none none reset"
                        }
                    })
                })
            }

        }, containerRef)

        return () => ctx.revert() // Cleanup
    }, [])

    return (
        <div className={Styles.container} ref={containerRef}>
            <div className={Styles.titleImageContainer}>
                <div className={Styles.titleContainer}>

                    <div className={Styles.tag} ref={tagRef}>
                        <HeartHandshake className={Styles.icon}/>
                        <p>Amra Ekshathe</p>
                    </div>

                    <h1 className={Styles.title} ref={titleRef}>
                        Connect Volunteers with Meaningful Cause
                    </h1>
                    
                    <p ref={paragraphRef}>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe placeat, ex nemo eius nostrum dolor quidem vel ad fuga impedit natus, in atque amet corrupti aliquam iure enim minus eum.
                    </p>
                
                    <div className={Styles.buttonContainer} ref={buttonsRef}>
                        <Link href='/auth/login-signup'>
                            <Button
                                variant='primary'
                                label='Signin As a Volunteer'
                                showIcon
                                size='large'
                            />
                        </Link>
                        <Link href='/auth/login-signup'>
                            <Button
                                variant='secondary'
                                label='Signin As a Organization'
                                showIcon
                                size='large'
                            />
                        </Link>
                    </div>
                </div>

                <div className={Styles.imageContainer} >
                    <HeroImage />
                </div>
            </div>

            <div className={Styles.infoContainer}>
                <h2 className={Styles.infoContainerTitle} ref={infoTitleRef}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </h2>
                <div className={Styles.statContainerWrapper} ref={statsRef}>
                    <div className={Styles.statContainer}>
                        <h2 className={Styles.infoTitle}>510</h2>
                        <p className={Styles.infoSubtitle}>Projects</p>
                    </div>

                    <div className={Styles.statContainer}>
                        <h2 className={Styles.infoTitle}>160</h2>
                        <p className={Styles.infoSubtitle}>Organizations</p>
                    </div>

                    <div className={Styles.statContainer}>
                        <h2 className={Styles.infoTitle}>1600</h2>
                        <p className={Styles.infoSubtitle}>Volunteers</p>
                    </div>
                </div>
            </div>
        </div>
    )
}