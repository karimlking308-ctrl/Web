export const MONETAG_DIRECT_LINK = 'https://omg10.com/4/11659899';

/**
 * Opens Monetag direct monetization link in a new window/tab safely.
 */
export const triggerMonetagDirectLink = (): void => {
  try {
    if (typeof window !== 'undefined') {
      window.open(MONETAG_DIRECT_LINK, '_blank', 'noopener,noreferrer');
    }
  } catch (err) {
    console.error('Failed to trigger Monetag direct link:', err);
  }
};
