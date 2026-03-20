/**
 * Format points with thousand separators
 */
export const formatPoints = (points: string | number): string => {
    const num = typeof points === 'string' ? parseInt(points.replace(/,/g, ''), 10) : points;
    if (isNaN(num)) return '0';
    return new Intl.NumberFormat().format(num);
};

/**
 * Format large numbers as K, M, B
 */
export const formatCompactNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1
    }).format(num);
};
