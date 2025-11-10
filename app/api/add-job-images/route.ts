import { NextRequest, NextResponse } from 'next/server';
import { getDbInstance } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

// Map of job titles to relevant image URLs from Unsplash
const jobImageMap: { [key: string]: string } = {
  'Senior Full Stack Developer': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
  'Digital Marketing Manager': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
  'UX/UI Designer': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
  'Data Scientist': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
  'Mobile App Developer (iOS)': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
  'Customer Success Manager': 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop',
  'DevOps Engineer': 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=600&fit=crop',
  'Content Writer': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop',
  'Business Analyst': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
  'HR Recruitment Specialist': 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop',
  'Backend Developer (Node.js)': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
  'Product Manager': 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop',
  'Graphic Designer': 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop',
  'QA Automation Engineer': 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&h=600&fit=crop',
  'Sales Executive': 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop',
  'Cybersecurity Analyst': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop',
  'Video Editor': 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop',
  'Financial Analyst': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=600&fit=crop',
  'Cloud Architect': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
  'Project Coordinator': 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&h=600&fit=crop',
};

export async function GET(request: NextRequest) {
  try {
    const db = getDbInstance();
    const jobsCollection = collection(db, 'jobs');
    const q = query(jobsCollection, where('agencyId', '==', 'sample-agency-001'));
    const querySnapshot = await getDocs(q);

    const results = [];

    for (const docSnapshot of querySnapshot.docs) {
      const jobData = docSnapshot.data();
      const title = jobData.title;
      const imageUrl = jobImageMap[title];

      if (imageUrl) {
        try {
          const jobRef = doc(db, 'jobs', docSnapshot.id);
          await updateDoc(jobRef, { imageUrl });
          results.push({
            success: true,
            id: docSnapshot.id,
            title,
            imageUrl
          });
        } catch (error: any) {
          results.push({
            success: false,
            id: docSnapshot.id,
            title,
            error: error.message
          });
        }
      } else {
        results.push({
          success: false,
          id: docSnapshot.id,
          title,
          error: 'No image mapping found'
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: true,
      message: `Updated ${successCount} jobs with images successfully, ${failCount} failed`,
      results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
