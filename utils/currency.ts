// utils/currency.ts

export const formatCurrency = (
    amount: number,
    currency: string = 'TRY',
    locale: string = 'tr-TR'
): string => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};
