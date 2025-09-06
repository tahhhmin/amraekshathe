'use client';
import ThemeToggleButton from '@/components/custom-buttons/ThemeButton';
import Styles from './styles/page.module.css';
import HeroSection from '@/components/home-page/HeroSection';
import ImageSection from '@/components/home-page/ImageSection';

export default function Home() {
    return (
        <main className={Styles.page}>
            <HeroSection />
            <div className={Styles.imageSection}>
                <ImageSection />
            </div>
            <ThemeToggleButton />
        </main>
    );
}