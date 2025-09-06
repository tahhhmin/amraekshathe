import React from 'react'
import Button from '@/components/common/button/Button';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggleButton() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
            setMounted(true);
        }, []);
        if (!mounted) return null;
        const isDark = theme === 'dark';

    return (
        <Button 
            variant="icon"
            showIcon={true}
            icon={isDark ? 'Sun' : 'Moon'}
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            shapeless={true}
        />
    )
}