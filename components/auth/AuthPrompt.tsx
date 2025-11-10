'use client';

import React from 'react';
import { Lock, Briefcase, Bookmark, MessageCircle, User, Sparkles } from 'lucide-react';

export interface AuthPromptContext {
  /**
   * Action that requires authentication
   */
  action: 'apply' | 'save' | 'message' | 'view_applications' | 'view_profile' | 'ai_advanced';
  /**
   * Title for the prompt
   */
  title: string;
  /**
   * Description of what the user will get
   */
  description: string;
  /**
   * Main benefit message
   */
  benefit: string;
  /**
   * Optional job ID (for apply action)
   */
  jobId?: string;
  /**
   * Return URL after authentication
   */
  returnUrl?: string;
  /**
   * User type for signup (defaults to 'jobhunter')
   */
  userType?: 'jobhunter' | 'agency' | 'admin';
}

interface AuthPromptProps {
  context: AuthPromptContext;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * AuthPrompt Component
 *
 * Displays the reason why authentication is needed for a specific action.
 * Used inside SignupModal to show context-specific messaging.
 *
 * @example
 * ```tsx
 * <AuthPrompt
 *   context={{
 *     action: 'apply',
 *     title: 'Sign up to apply',
 *     description: 'Create an account to apply to this job',
 *     benefit: 'Track your applications and get real-time updates',
 *     jobId: '123',
 *   }}
 * />
 * ```
 */
export default function AuthPrompt({ context, className = '' }: AuthPromptProps) {
  const getIcon = () => {
    switch (context.action) {
      case 'apply':
        return <Briefcase size={48} className="text-primary-600" />;
      case 'save':
        return <Bookmark size={48} className="text-primary-600" />;
      case 'message':
        return <MessageCircle size={48} className="text-primary-600" />;
      case 'view_applications':
        return <Briefcase size={48} className="text-primary-600" />;
      case 'view_profile':
        return <User size={48} className="text-primary-600" />;
      case 'ai_advanced':
        return <Sparkles size={48} className="text-primary-600" />;
      default:
        return <Lock size={48} className="text-primary-600" />;
    }
  };

  return (
    <div className={`text-center py-6 ${className}`}>
      {/* Icon */}
      <div className="mb-4 flex justify-center">
        <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center">
          {getIcon()}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        {context.title}
      </h3>

      {/* Description */}
      <p className="text-base text-gray-600 mb-4 max-w-md mx-auto">
        {context.description}
      </p>

      {/* Benefit */}
      <div className="bg-primary-50 rounded-lg p-4 max-w-md mx-auto">
        <p className="text-sm font-medium text-primary-900">
          💡 {context.benefit}
        </p>
      </div>
    </div>
  );
}

/**
 * Pre-configured auth prompts for common scenarios
 */

export const AUTH_PROMPTS: Record<string, Omit<AuthPromptContext, 'jobId' | 'returnUrl'>> = {
  apply: {
    action: 'apply',
    title: 'Sign up to apply',
    description: 'Create a free account to apply to this job and track your application status.',
    benefit: 'Get real-time updates and directly message agencies',
  },
  save: {
    action: 'save',
    title: 'Sign up to save jobs',
    description: 'Create an account to save jobs you\'re interested in and access them anytime.',
    benefit: 'Build your personalized job collection',
  },
  message: {
    action: 'message',
    title: 'Sign up to message agencies',
    description: 'Create an account to directly connect with agencies and ask questions.',
    benefit: 'Get quick responses and build professional relationships',
  },
  view_applications: {
    action: 'view_applications',
    title: 'Sign up to track applications',
    description: 'Create an account to view and manage all your job applications in one place.',
    benefit: 'Never lose track of your job search progress',
  },
  view_profile: {
    action: 'view_profile',
    title: 'Sign up to create your profile',
    description: 'Build your professional profile to get matched with the right opportunities.',
    benefit: 'Stand out to agencies with a complete profile',
  },
  ai_advanced: {
    action: 'ai_advanced',
    title: 'Sign up for unlimited AI assistance',
    description: 'Get unlimited access to GABAY AI assistant with personalized recommendations.',
    benefit: 'Free AI-powered guidance for your OFW journey',
  },
};
