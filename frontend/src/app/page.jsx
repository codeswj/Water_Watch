import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="flex-1 bg-gradient-to-br from-sky-600 to-sky-800 text-white flex items-center">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="text-6xl mb-6">💧</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
            Water Source Mapping<br />&amp; Quality Reporting
          </h1>
          <p className="text-sky-100 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Real-time monitoring of water sources. Community-powered reporting.
            AI-assisted contamination detection. Built for SDG 6.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/map"
              className="bg-white text-sky-700 px-8 py-3 rounded-xl font-bold text-base hover:bg-sky-50 transition shadow">
              View Map
            </Link>
            <Link href="/register"
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-bold text-base hover:bg-sky-700 transition">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-12">What WaterWatch Does</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '🗺️', title: 'GIS Mapping',          desc: 'Interactive map showing real-time safety status of every water source — boreholes, rivers, wells, springs.' },
              { icon: '📡', title: 'IoT Sensor Data',       desc: 'Live sensor readings of pH, turbidity, temperature, dissolved oxygen, conductivity, and contaminant levels.' },
              { icon: '📝', title: 'Community Reporting',   desc: 'Any registered user can submit a water quality issue with GPS tagging and a photo.' },
              { icon: '🚨', title: 'Automated Alerts',      desc: 'When sensor readings exceed safe thresholds, authorities are instantly notified with severity-ranked alerts.' },
              { icon: '📊', title: 'Analytics Dashboard',   desc: 'Trend charts and contamination heatmaps to support evidence-based decisions by policymakers.' },
              { icon: '🔐', title: 'Role-Based Access',     desc: 'Three roles: Public, Field Officer, and Admin — each with a tailored interface and access level.' },
            ].map((f) => (
              <div key={f.title} className="bg-sky-50 rounded-xl p-6 border border-sky-100">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
