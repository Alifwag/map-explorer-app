export const lightTheme = {
  colors: {
    primary: '#0066ff',
    primaryLight: '#3399ff',
    primaryDark: '#0052cc',
    
    secondary: '#764ba2',
    secondaryLight: '#9b6fc0',
    secondaryDark: '#5a3d7a',
    
    success: '#00cc44',
    warning: '#ffaa00',
    error: '#ff3333',
    info: '#00b8d4',
    
    background: '#ffffff',
    backgroundSecondary: '#f5f6fa',
    surface: '#ffffff',
    surfaceHover: '#f8f9fa',
    
    text: '#1a1a1a',
    textSecondary: '#666666',
    textMuted: '#999999',
    textInverse: '#ffffff',
    
    border: '#e0e0e0',
    borderLight: '#f0f0f0',
    divider: '#f0f0f0',
    
    shadow: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    
    gradientPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gradientSecondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    gradientSuccess: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    gradientWarning: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    
    traffic: {
      lancar: '#00cc44',
      sedang: '#ffaa00',
      macet: '#ff3333'
    },
    
    categories: {
      restaurant: '#ff6b6b',
      hospital: '#ff4757',
      atm: '#2ed573',
      tourism: '#ffa502',
      gas_station: '#5352ed',
      supermarket: '#7bed9f',
      hotel: '#eccc68',
      transport: '#1e90ff'
    }
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  
  borderRadius: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    xl: '24px',
    full: '50%'
  },
  
  shadows: {
    sm: '0 2px 4px rgba(0,0,0,0.1)',
    md: '0 4px 12px rgba(0,0,0,0.1)',
    lg: '0 8px 24px rgba(0,0,0,0.15)',
    xl: '0 12px 48px rgba(0,0,0,0.2)'
  },
  
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSizes: {
      xs: '11px',
      sm: '13px',
      md: '15px',
      lg: '18px',
      xl: '24px',
      xxl: '32px',
      hero: '48px'
    },
    fontWeights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 900
    }
  },
  
  transitions: {
    fast: '0.2s ease',
    normal: '0.3s ease',
    slow: '0.5s ease'
  },
  
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    laptop: '1024px',
    desktop: '1200px'
  }
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: '#3399ff',
    primaryLight: '#66b3ff',
    primaryDark: '#0066cc',
    
    background: '#1a1a2e',
    backgroundSecondary: '#16213e',
    surface: '#0f3460',
    surfaceHover: '#1a1a4e',
    
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    textMuted: '#808080',
    textInverse: '#1a1a1a',
    
    border: '#2a2a4e',
    borderLight: '#1a1a3e',
    divider: '#2a2a4e',
    
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.7)'
  }
};

export const getTheme = (mode) => {
  return mode === 'dark' ? darkTheme : lightTheme;
};

export default {
  light: lightTheme,
  dark: darkTheme
};