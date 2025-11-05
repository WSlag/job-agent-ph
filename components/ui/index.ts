/**
 * UI Components Library
 *
 * Centralized exports for all reusable UI components.
 * Import from this file for consistent component usage.
 *
 * @example
 * ```tsx
 * import { Button, Badge, ProgressBar } from '@/components/ui';
 * ```
 */

// Base Components
export { default as Badge } from './Badge';
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Modal } from './Modal';

// New Core Components (Phase 2)
export { default as ProgressBar, ProgressBarWithSteps } from './ProgressBar';
export { default as StepIndicator, VerticalStepIndicator } from './StepIndicator';
export { default as Chip, ChipGroup } from './Chip';
export { default as BottomSheet, BottomSheetTrigger } from './BottomSheet';
export { default as Timeline } from './Timeline';
export { default as StatCard, StatCardGrid } from './StatCard';
export {
  default as EmptyState,
  NoJobsEmptyState,
  NoApplicationsEmptyState,
  NoMessagesEmptyState,
  NoSavedJobsEmptyState,
  NoNotificationsEmptyState,
} from './EmptyState';
export {
  default as ErrorState,
  NetworkErrorState,
  NotFoundErrorState,
  UnauthorizedErrorState,
  ServerErrorState,
  DataLoadErrorState,
  OfflineErrorState,
} from './ErrorState';

// Skeleton Loaders (Phase 6)
export {
  SkeletonLoader,
  JobCardSkeleton,
  ApplicationCardSkeleton,
  ProfileSkeleton,
  MessageSkeleton,
  StatCardSkeleton,
  TimelineSkeleton,
} from './SkeletonLoader';

// Type exports
export type { default as TimelineStep } from './Timeline';
