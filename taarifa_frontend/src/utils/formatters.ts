/**
 * Format currency for Tanzanian Shilling (TZS)
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'TZS',
  locale: string = 'en-TZ'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format currency with decimals
 */
export const formatCurrencyWithDecimals = (
  amount: number,
  currency: string = 'TZS'
): string => {
  return new Intl.NumberFormat('en-TZ', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format compact currency (e.g., 1.5M instead of 1,500,000)
 */
export const formatCompactCurrency = (amount: number): string => {
  if (amount >= 1000000) {
    return `TZS ${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `TZS ${(amount / 1000).toFixed(1)}K`;
  }
  return `TZS ${amount}`;
};

/**
 * Format number with commas
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-TZ').format(num);
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format date
 */
export const formatDate = (
  date: string | Date,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Define options with proper TypeScript types using 'as const'
  const optionsMap = {
    short: {
      month: 'numeric' as const,
      day: 'numeric' as const,
      year: '2-digit' as const,
    },
    medium: {
      month: 'short' as const,
      day: 'numeric' as const,
      year: 'numeric' as const,
    },
    long: {
      month: 'long' as const,
      day: 'numeric' as const,
      year: 'numeric' as const,
    },
    full: {
      weekday: 'long' as const,
      month: 'long' as const,
      day: 'numeric' as const,
      year: 'numeric' as const,
    },
  };

  const options = optionsMap[format];
  return new Intl.DateTimeFormat('en-TZ', options).format(dateObj);
};

/**
 * Format relative time (e.g., "2 days ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const then = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - then.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${diffYears}y ago`;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Format phone number (Tanzania)
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 12 && cleaned.startsWith('255')) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
};

/**
 * Format salary range
 */
export const formatSalaryRange = (min: number, max: number): string => {
  return `${formatCompactCurrency(min)} - ${formatCompactCurrency(max)}`;
};

/**
 * Truncate text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}...`;
};

/**
 * Capitalize first letter
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Slugify text for URLs
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};