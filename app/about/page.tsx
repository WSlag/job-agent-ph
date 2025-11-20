import Link from 'next/link';
import Card from '@/components/ui/Card';
import Section from '@/components/ui/Section';
import { Users, Target, Heart, Award, Briefcase, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">About Job Agency PH</h1>
          <p className="text-xl text-blue-100">
            Connecting talented Filipino professionals with opportunities worldwide
          </p>
        </div>
      </Section>

      {/* Mission & Vision */}
      <Section className="py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <Card className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              To empower Filipino job seekers by providing access to quality employment opportunities
              and helping employers find the right talent to grow their businesses. We strive to make
              the job search process transparent, efficient, and rewarding for everyone involved.
            </p>
          </Card>

          <Card className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Heart className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              To become the Philippines' most trusted and comprehensive job platform, where every
              Filipino professional can find meaningful work that aligns with their skills and
              aspirations, and every employer can discover exceptional talent.
            </p>
          </Card>
        </div>
      </Section>

      {/* Our Story */}
      <Section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p>
              Job Agency PH was founded with a simple yet powerful vision: to bridge the gap between
              talented Filipino professionals and employers seeking quality talent. We recognized that
              both job seekers and employers faced challenges in the traditional recruitment process –
              it was time-consuming, opaque, and often inefficient.
            </p>
            <p>
              Our platform leverages modern technology to streamline the hiring process, making it
              easier for job seekers to discover opportunities that match their skills and for employers
              to connect with qualified candidates. We're committed to transparency, efficiency, and
              creating meaningful connections that benefit both parties.
            </p>
            <p>
              Today, we're proud to serve thousands of job seekers and hundreds of employers across
              the Philippines, facilitating connections that lead to successful careers and thriving
              businesses.
            </p>
          </div>
        </div>
      </Section>

      {/* Our Values */}
      <Section className="py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">People First</h3>
              <p className="text-gray-600">
                We prioritize the needs and success of both job seekers and employers, ensuring a
                positive experience for everyone.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Excellence</h3>
              <p className="text-gray-600">
                We maintain high standards in everything we do, from the quality of job listings to
                our customer support.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously improve our platform using the latest technology to provide the best
                job search experience.
              </p>
            </Card>
          </div>
        </div>
      </Section>

      {/* Statistics - Hidden */}
      {/* <Section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Impact</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Job Seekers</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Employers</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">5K+</div>
              <div className="text-blue-100">Jobs Posted</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">8K+</div>
              <div className="text-blue-100">Successful Placements</div>
            </div>
          </div>
        </div>
      </Section> */}

      {/* Team Section */}
      <Section className="py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Join Our Journey</h2>
          <p className="text-gray-700 leading-relaxed mb-8">
            We're constantly growing and improving our platform to better serve the Filipino job market.
            Whether you're a job seeker looking for your next opportunity or an employer seeking top talent,
            we're here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Briefcase className="w-5 h-5 mr-2" />
              Browse Jobs
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
