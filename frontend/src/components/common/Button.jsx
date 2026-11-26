import React from 'react'

/**
 * Button — pill-shaped, 5 variants.
 *
 * Props:
 *   variant   'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'  (default: 'primary')
 *   size      'md' | 'sm' | 'icon'  (default: 'md')
 *   as        element type (default: 'button')
 *   All other native button props forwarded.
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  as: Tag = 'button',
  className = '',
  children,
  ...props
}) {
  const base = {
    primary:   'cs-btn-primary',
    secondary: 'cs-btn-secondary',
    ghost:     'cs-btn-ghost',
    danger:    'cs-btn-danger',
    outline:   'cs-btn-outline',
  }[variant] ?? 'cs-btn-primary'

  const sizeClass = {
    md:   '',
    sm:   'cs-btn-sm',
    icon: 'cs-btn-icon',
  }[size] ?? ''

  return (
    <Tag className={`${base} ${sizeClass} ${className}`} {...props}>
      {children}
    </Tag>
  )
}
