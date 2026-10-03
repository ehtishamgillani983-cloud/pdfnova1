/**
 * Access Control Service for PDFNova
 * All PDF & AI Document tools are 100% free with unlimited access.
 */

import { Tool } from '../types';

class SubscriptionService {
  /**
   * Access check for any specific tool - All tools are 100% free!
   */
  public async canAccessTool(_tool: Tool): Promise<{
    allowed: boolean;
    reason?: 'free';
  }> {
    return { allowed: true, reason: 'free' };
  }
}

export const subscriptionService = new SubscriptionService();
