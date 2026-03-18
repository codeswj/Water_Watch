import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ReportForm from '@/components/forms/ReportForm';

export const metadata = { title: 'Report Issue — WaterWatch' };

export default function ReportPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 px-4 bg-sky-50">
        <ReportForm />
      </main>
      <Footer />
    </div>
  );
}
