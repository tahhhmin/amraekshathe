'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';
import Styles from './Button.module.css';
import CircleLoader from '@/components/common/Progress/CircleLoader';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outlined'
  | 'icon'
  | 'action'
  | 'danger'
  | 'submit'
  | 'loading';

interface ButtonProps {
  variant?: ButtonVariant;
  label?: string;
  showIcon?: boolean;
  icon?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

export default function Button({
    variant = 'primary',
    label,
    showIcon,
    icon,
    type = 'button',
    disabled = false,
    onClick,
}: ButtonProps) {
  const isLoading = variant === 'loading';

  const IconComponent = (icon && icon in LucideIcons
    ? LucideIcons[icon as keyof typeof LucideIcons]
    : LucideIcons.ArrowUpRight) as React.ElementType;

  const buttonClassName = `${Styles.button} ${Styles[variant] || ''}`;

    return (
        <button
        className={buttonClassName}
        onClick={onClick}
        disabled={disabled || isLoading}
        type={type}
        aria-label={!label && showIcon ? 'button icon' : label}
        >
        {showIcon && (
            isLoading ? (
            <CircleLoader size={18} color="#fff" backgroundColor="#888" thickness={2} />
            ) : (
            IconComponent && <IconComponent className={Styles.buttonIcon} size={24} />
            )
        )}
        {label && <span className={Styles.buttonLabel}>{label}</span>}
        </button>
    );
}
