interface IBAMLogoProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge'
  className?: string
  style?: React.CSSProperties
}

export default function IBAMLogo({ 
  size = 'medium', 
  className = '',
  style = {}
}: IBAMLogoProps) {
  const sizeMap = {
    small: { width: '24px', height: 'auto' },
    medium: { width: '40px', height: 'auto' },
    large: { width: '60px', height: 'auto' },
    xlarge: { width: '120px', height: 'auto' }
  }

  const logoFile = size === 'small' 
    ? '/images/branding/mini-logo.png'
    : '/images/branding/ibam-logo.png'

  return (
    <img
      src={logoFile}
      alt="IBAM - International Business and Missions"
      style={{
        ...sizeMap[size],
        objectFit: 'contain',
        ...style
      }}
      className={className}
      onError={(e) => {
        const target = e.currentTarget as HTMLImageElement
        if (target.src.includes('ibam-logo.png')) {
          target.src = '/images/branding/ibam-logo-copy.jpg'
        } else if (target.src.includes('mini-logo.png')) {
          target.src = '/images/branding/ibam-logo.png'
        }
      }}
    />
  )
}