'use client';
import Styles from './styles/page.module.css';
import HeroSection from '@/components/home-page/HeroSection';
import HeroImage from '@/components/home-page/HeroImage';

export default function Home() {
    return (
        <main className={Styles.page}>
            <HeroSection />
            <div className={Styles.heroImage}>
                <HeroImage />
            </div>
        </main>
    );
}