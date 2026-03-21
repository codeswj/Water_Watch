'use client';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
        <span>💧 WaterWatch — Water Source Mapping & Quality Reporting System</span>
        <span>Shawb William &mdash; {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
