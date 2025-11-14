'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { getFeaturedJobs, updateFeaturedPriority, removeFeaturedJob } from '@/lib/featured-job-helpers';
import { Job } from '@/types';
import {
  Star,
  Loader2,
  GripVertical,
  Trash2,
  MapPin,
  Building2,
  DollarSign,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableItemProps {
  job: Job;
  index: number;
  onRemove: (jobId: string) => void;
}

function SortableItem({ job, index, onRemove }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatDate = (date: Date | any) => {
    const d = date?.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatSalary = () => {
    if (!job.salaryMin && !job.salaryMax) return 'Negotiable';
    if (job.salaryMin && job.salaryMax) {
      return `${job.currency} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`;
    }
    if (job.salaryMin) return `${job.currency} ${job.salaryMin.toLocaleString()}+`;
    return `${job.currency} ${job.salaryMax?.toLocaleString()}`;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border-2 ${
        isDragging ? 'border-blue-500 shadow-xl' : 'border-gray-200'
      } rounded-xl p-4 md:p-6 hover:shadow-lg transition-all`}
    >
      <div className="flex items-start gap-2 md:gap-4">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 mt-1"
        >
          <GripVertical size={20} />
        </button>

        {/* Priority Badge */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-base md:text-lg shadow-lg">
            {index + 1}
          </div>
        </div>

        {/* Job Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 md:gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-base md:text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Building2 size={14} />
                <span className="text-sm md:text-base font-medium">{job.companyName}</span>
              </div>
            </div>
            <button
              onClick={() => onRemove(job.id)}
              className="bg-red-50 text-red-600 p-1.5 md:p-2 rounded-lg hover:bg-red-100 transition-colors flex-shrink-0"
              title="Remove from featured"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={14} className="flex-shrink-0" />
              <span>
                {job.location}, {job.country}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign size={14} className="flex-shrink-0" />
              <span className="font-semibold">{formatSalary()}</span>
            </div>

            {job.featuredAt && (
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar size={14} className="flex-shrink-0" />
                <span>Featured since {formatDate(job.featuredAt)}</span>
              </div>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                {job.locationType}
              </span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                {job.jobType}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadFeaturedJobs();
  }, []);

  const loadFeaturedJobs = async () => {
    setLoading(true);
    try {
      const data = await getFeaturedJobs();
      setJobs(data);
      setHasChanges(false);
    } catch (error) {
      console.error('Error loading featured jobs:', error);
      toast.error('Failed to load featured jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setJobs((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        setHasChanges(true);
        return newItems;
      });
    }
  };

  const handleRemove = async (jobId: string) => {
    if (!confirm('Are you sure you want to remove this job from featured?')) {
      return;
    }

    try {
      await removeFeaturedJob(jobId);
      toast.success('Job removed from featured');
      await loadFeaturedJobs();
    } catch (error: any) {
      console.error('Error removing featured job:', error);
      toast.error(error.message || 'Failed to remove job');
    }
  };

  const handleSaveOrder = async () => {
    setSaving(true);

    try {
      // Update each job's priority based on its position
      await Promise.all(
        jobs.map((job, index) =>
          updateFeaturedPriority(job.id, index + 1)
        )
      );

      toast.success('Featured jobs order updated successfully!');
      setHasChanges(false);
      await loadFeaturedJobs();
    } catch (error: any) {
      console.error('Error saving order:', error);
      toast.error(error.message || 'Failed to save order');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Discard all changes and reload?')) {
      loadFeaturedJobs();
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Featured Jobs Carousel</h1>
          <p className="text-sm md:text-base text-gray-600">
            Drag and drop to reorder featured jobs. The order here determines the carousel order on the homepage.
          </p>
        </div>

        {/* Status Bar */}
        <div className="bg-white rounded-xl shadow-sm p-3 md:p-4 mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="flex items-center gap-2">
                <Star className="text-yellow-600" size={18} />
                <span className="text-sm md:text-base font-semibold text-gray-900">
                  {jobs.length} / 5 Featured Jobs
                </span>
              </div>
              {jobs.length < 5 && (
                <span className="text-xs md:text-sm text-gray-600">
                  ({5 - jobs.length} slot{5 - jobs.length !== 1 ? 's' : ''} available)
                </span>
              )}
            </div>

            {hasChanges && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3">
                <span className="text-xs md:text-sm text-orange-600 font-medium text-center sm:text-left">Unsaved changes</span>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    disabled={saving}
                    className="flex-1 sm:flex-none px-3 md:px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleSaveOrder}
                    disabled={saving}
                    className="flex-1 sm:flex-none bg-blue-600 text-white px-4 md:px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Saving...
                      </>
                    ) : (
                      'Save Order'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Banner */}
        {jobs.length < 5 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
            <div className="flex items-start gap-2 md:gap-3">
              <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-xs md:text-sm font-medium text-blue-900 mb-1">
                  {5 - jobs.length} Featured Slot{5 - jobs.length !== 1 ? 's' : ''} Available
                </p>
                <p className="text-xs text-blue-700">
                  Review pending requests from the Featured Requests page to fill these slots.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Featured Jobs List */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 text-center">
            <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={36} />
            <p className="text-sm md:text-base text-gray-600">Loading featured jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 text-center">
            <Star className="text-gray-300 mx-auto mb-4" size={48} />
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">No Featured Jobs</h3>
            <p className="text-sm md:text-base text-gray-600 mb-6">
              There are currently no jobs in the featured carousel. Approve requests from agencies to add featured jobs.
            </p>
            <a
              href="/admin/featured-requests"
              className="inline-block bg-blue-600 text-white px-5 md:px-6 py-2.5 md:py-3 rounded-lg text-sm md:text-base font-semibold hover:bg-blue-700 transition-colors"
            >
              View Pending Requests
            </a>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={jobs.map((job) => job.id)}
                strategy={verticalListSortingStrategy}
              >
                {jobs.map((job, index) => (
                  <SortableItem
                    key={job.id}
                    job={job}
                    index={index}
                    onRemove={handleRemove}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        )}

        {/* Instructions */}
        {jobs.length > 0 && (
          <div className="mt-6 md:mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4 md:p-6">
            <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-3">How to Manage Featured Jobs</h3>
            <ul className="space-y-2 text-xs md:text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>
                  <strong>Reorder:</strong> Drag and drop jobs using the handle icon to change their position in the carousel
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>
                  <strong>Priority:</strong> Position 1 appears first in the carousel, position 5 appears last
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>
                  <strong>Remove:</strong> Click the trash icon to remove a job from the featured carousel
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>
                  <strong>Save:</strong> Don't forget to click "Save Order" after making changes
                </span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
