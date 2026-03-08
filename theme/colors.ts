// theme/colors.ts

export interface ThemeColors {
    readonly primary: {
        readonly deep: string;
        readonly dark: string;
        readonly medium: string;
        readonly brand: string;
        readonly light: string;
    };
    readonly neutral: {
        readonly white: string;
        readonly offWhite: string;
        readonly muted: string;
    };
    readonly accent: {
        readonly teal: string;
        readonly red: string;
        readonly amber: string;
        readonly green: string;
        readonly purple: string;
    };
    readonly glass: {
        readonly surface: {
            readonly primary: string;
            readonly secondary: string;
            readonly elevated: string;
            readonly highlight: string;
        };
        readonly border: {
            readonly subtle: string;
            readonly default: string;
            readonly strong: string;
        };
        readonly text: {
            readonly primary: string;
            readonly secondary: string;
            readonly muted: string;
        };
    };
    readonly gradients: {
        readonly brand: readonly string[];
        readonly surface: readonly string[];
        readonly income: readonly string[];
        readonly expense: readonly string[];
        readonly ai: readonly string[];
        readonly savings: readonly string[];
        readonly goal: readonly string[];
    };
}

export const THEMES: { dark: ThemeColors; light: ThemeColors } = {
    dark: {
        primary: {
            deep: '#0C0014',
            dark: '#1A0533',
            medium: '#2D0F5E',
            brand: '#6C3CE1',
            light: '#9B6BF2',
        },
        neutral: {
            white: '#FFFFFF',
            offWhite: '#E8E0F0',
            muted: '#6B5F80',
        },
        accent: {
            teal: '#00E5CC',
            red: '#FF4D6D',
            amber: '#FFD166',
            green: '#38EF7D',
            purple: '#9D50BB',
        },
        glass: {
            surface: {
                primary: 'rgba(255, 255, 255, 0.05)',
                secondary: 'rgba(255, 255, 255, 0.03)',
                elevated: 'rgba(255, 255, 255, 0.09)',
                highlight: 'rgba(255, 255, 255, 0.12)',
            },
            border: {
                subtle: 'rgba(255, 255, 255, 0.06)',
                default: 'rgba(255, 255, 255, 0.14)',
                strong: 'rgba(255, 255, 255, 0.22)',
            },
            text: {
                primary: '#FFFFFF',
                secondary: 'rgba(255, 255, 255, 0.65)',
                muted: 'rgba(255, 255, 255, 0.45)',
            },
        },
        gradients: {
            brand: ['#2D0F5E', '#6C3CE1'],
            surface: ['#1A0533', '#0C0014'],
            income: ['#00E5CC', '#38EF7D'],
            expense: ['#FF4D6D', '#FF8C42'],
            ai: ['#FFD166', '#FF9A3C'],
            savings: ['#11998E', '#38EF7D'],
            goal: ['#DA22FF', '#9733EE'],
        }
    },
    light: {
        primary: {
            deep: '#F4F7FB',
            dark: '#FFFFFF',
            medium: '#EDF1F7',
            brand: '#6C3CE1',
            light: '#8E64F2',
        },
        neutral: {
            white: '#1A0533',
            offWhite: '#2D0F5E',
            muted: '#8A8496',
        },
        accent: {
            teal: '#00BFA5',
            red: '#FF3B5C',
            amber: '#FFB300',
            green: '#2ECC71',
            purple: '#8E44AD',
        },
        glass: {
            surface: {
                primary: 'rgba(108, 60, 225, 0.03)',
                secondary: 'rgba(108, 60, 225, 0.015)',
                elevated: 'rgba(108, 60, 225, 0.06)',
                highlight: 'rgba(108, 60, 225, 0.1)',
            },
            border: {
                subtle: 'rgba(108, 60, 225, 0.05)',
                default: 'rgba(108, 60, 225, 0.1)',
                strong: 'rgba(108, 60, 225, 0.15)',
            },
            text: {
                primary: '#1A0533',
                secondary: 'rgba(26, 5, 51, 0.7)',
                muted: 'rgba(26, 5, 51, 0.45)',
            },
        },
        gradients: {
            brand: ['#8E64F2', '#6C3CE1'], // Darker start for white text
            surface: ['#FFFFFF', '#F4F7FB'],
            income: ['#00BFA5', '#00897B'],
            expense: ['#FF3B5C', '#D81B60'],
            ai: ['#FFB300', '#F57C00'],
            savings: ['#00BFA5', '#00796B'],
            goal: ['#DA22FF', '#9733EE'],
        }
    }
};

export const COLORS = THEMES.dark;
export const GRADIENTS = THEMES.dark.gradients;

export const RADIUS = {
    sm: 10,
    md: 14,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
    full: 9999,
} as const;

export const GLASS = THEMES.dark.glass;
export const CATEGORY_COLORS = {
    food: '#FF6B6B',
    transport: '#4ECDC4',
    shopping: '#45B7D1',
    entertainment: '#96CEB4',
    health: '#88D8B0',
    education: '#FFEAA7',
    housing: '#DDA0DD',
    salary: '#00D2FF',
    freelance: '#38EF7D',
    investment: '#FFD700',
    other: '#B8B8B8',
} as const;
