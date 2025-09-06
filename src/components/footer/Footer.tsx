import React from 'react'
import Link from 'next/link'
import { 
    HeartHandshake, 
    Mail, 
    Phone, 
    MapPin, 
    Facebook, 
    Twitter, 
    Instagram, 
    Linkedin,
    Youtube,
    ArrowRight 
} from 'lucide-react'
import Styles from './Footer.module.css'
import Button from '../common/button/Button'

export default function Footer() {
    return (
        <footer className={Styles.footer}>
            <div className={Styles.container}>
                {/* Main Footer Content */}
                <div className={Styles.mainContent}>
                    {/* Company Info Section */}
                    <div className={Styles.section}>
                        <div className={Styles.brand}>
                            <HeartHandshake className={Styles.brandIcon} />
                            <h3 className={Styles.brandName}>Amra Ekshathe</h3>
                        </div>
                        <p className={Styles.brandDescription}>
                            Connecting volunteers with meaningful causes to build stronger communities across Bangladesh. 
                            Join us in making a difference, one project at a time.
                        </p>
                        <div className={Styles.socialLinks}>
                            <a href="#" className={Styles.socialLink} aria-label="Facebook">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className={Styles.socialLink} aria-label="Twitter">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className={Styles.socialLink} aria-label="Instagram">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className={Styles.socialLink} aria-label="LinkedIn">
                                <Linkedin size={20} />
                            </a>
                            <a href="#" className={Styles.socialLink} aria-label="YouTube">
                                <Youtube size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className={Styles.section}>
                        <h3 className={Styles.sectionTitle}>Quick Links</h3>
                        <ul className={Styles.linkList}>
                            <li>
                                <Link href="/about" className={Styles.link}>
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/projects" className={Styles.link}>
                                    Browse Projects
                                </Link>
                            </li>
                            <li>
                                <Link href="/organizations" className={Styles.link}>
                                    Organizations
                                </Link>
                            </li>
                            <li>
                                <Link href="/volunteers" className={Styles.link}>
                                    Volunteers
                                </Link>
                            </li>
                            <li>
                                <Link href="/how-it-works" className={Styles.link}>
                                    How It Works
                                </Link>
                            </li>
                            <li>
                                <Link href="/success-stories" className={Styles.link}>
                                    Success Stories
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* For Organizations */}
                    <div className={Styles.section}>
                        <h3 className={Styles.sectionTitle}>For Organizations</h3>
                        <ul className={Styles.linkList}>
                            <li>
                                <Link href="/auth/signup/organization" className={Styles.link}>
                                    Sign Up as Organization
                                </Link>
                            </li>
                            <li>
                                <Link href="/post-project" className={Styles.link}>
                                    Post a Project
                                </Link>
                            </li>
                            <li>
                                <Link href="/manage-volunteers" className={Styles.link}>
                                    Manage Volunteers
                                </Link>
                            </li>
                            <li>
                                <Link href="/resources" className={Styles.link}>
                                    Resources & Guides
                                </Link>
                            </li>
                            <li>
                                <Link href="/organization-support" className={Styles.link}>
                                    Support Center
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* For Volunteers */}
                    <div className={Styles.section}>
                        <h3 className={Styles.sectionTitle}>For Volunteers</h3>
                        <ul className={Styles.linkList}>
                            <li>
                                <Link href="/auth/signup/volunteer" className={Styles.link}>
                                    Sign Up as Volunteer
                                </Link>
                            </li>
                            <li>
                                <Link href="/find-opportunities" className={Styles.link}>
                                    Find Opportunities
                                </Link>
                            </li>
                            <li>
                                <Link href="/volunteer-dashboard" className={Styles.link}>
                                    My Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/volunteer-guide" className={Styles.link}>
                                    Volunteer Guide
                                </Link>
                            </li>
                            <li>
                                <Link href="/community" className={Styles.link}>
                                    Community Forum
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className={Styles.section}>
                        <h3 className={Styles.sectionTitle}>Contact Us</h3>
                        <div className={Styles.contactInfo}>
                            <div className={Styles.contactItem}>
                                <MapPin className={Styles.contactIcon} size={16} />
                                <span>
                                    <p>House 123, Road 12</p>
                                    <p>Dhanmondi, Dhaka 1205</p>
                                    <p>Bangladesh</p>   
                                </span>
                            </div>
                            <div className={Styles.contactItem}>
                                <Phone className={Styles.contactIcon} size={16} />
                                <a href="tel:+8801712345678" className={Styles.contactLink}>
                                    +880 1712-345678
                                </a>
                            </div>
                            <div className={Styles.contactItem}>
                                <Mail className={Styles.contactIcon} size={16} />
                                <a href="mailto:hello@amraekshathe.org" className={Styles.contactLink}>
                                    hello@amraekshathe.org
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className={Styles.section}>
                        <h3 className={Styles.sectionTitle}>Stay Updated</h3>
                        <p className={Styles.newsletterText}>
                            Get the latest volunteer opportunities and success stories delivered to your inbox.
                        </p>
                        <form className={Styles.newsletterForm}>
                            <input 
                                type="email" 
                                placeholder="Enter your email"
                                className={Styles.emailInput}
                                required
                            />
                            <Button 
                                variant='icon'
                                showIcon 
                                icon='Send' 
                            />
        
                        </form>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className={Styles.bottomFooter}>
                    <div className={Styles.bottomContent}>
                        <p className={Styles.copyright}>
                            &copy; 2025 Amra Ekshathe. All Rights Reserved.
                        </p>
                        <div className={Styles.legalLinks}>
                            <Link href="/privacy-policy" className={Styles.legalLink}>
                               <p>Privacy Policy</p> 
                            </Link>
                            <Link href="/terms-of-service" className={Styles.legalLink}>
                                <p>Terms of Service</p> 
                            </Link>
                            <Link href="/cookie-policy" className={Styles.legalLink}>
                                <p>Cookie Policy</p>
                            </Link>
                            <Link href="/accessibility" className={Styles.legalLink}>
                                <p>Accessibility</p>   
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}