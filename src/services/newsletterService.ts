import { NewsletterSubscriber } from '../types';

/**
 * Service interface for Newsletter Subscriptions.
 * Prepared for Phase 5 integration (Email newsletter provider / worker).
 * Subscription does NOT require an account or authentication.
 */
export interface NewsletterService {
  subscribe(email: string): Promise<{ success: boolean; message: string }>;
}

export const newsletterService: NewsletterService = {
  async subscribe(email: string): Promise<{ success: boolean; message: string }> {
    // Validate basic email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return {
        success: false,
        message: 'Please provide a valid email address.'
      };
    }

    // Phase 1 UI simulation with latency
    await new Promise(resolve => setTimeout(resolve, 600));

    return {
      success: true,
      message: 'You have been added to the PULSE Market Brief waitlist. Live delivery begins with Phase 5.'
    };
  }
};
