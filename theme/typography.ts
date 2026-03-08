// theme/typography.ts

export const FONTS = {
    family: {
        // Inter is standard for functional UI, DM Sans for brand vibes
        // These will be loaded via expo-font
        regular: 'Inter-Regular',
        medium: 'Inter-Medium',
        semiBold: 'Inter-SemiBold',
        bold: 'Inter-Bold',
        extraBold: 'Inter-ExtraBold',
        brand: 'DMSans-Medium',
    },

    size: {
        xs: 11,
        sm: 13,
        md: 15,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 28,
        '4xl': 34,
        '5xl': 42,
        hero: 56,
    },

    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.8,
    }
} as const;
