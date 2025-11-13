import { Metadata } from 'next';
import ComparisonTool from '@/components/comparison/ComparisonTool';

export const metadata: Metadata = {
  title: 'Sammenlign Eiendommer - Aspelin Ramm Vulkan',
  description: 'Sammenlign nøkkeltall og data for eiendommer side-om-side',
};

export default function SammenligningPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <ComparisonTool />
    </main>
  );
}
