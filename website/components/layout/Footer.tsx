import Link from "next/link";
import { Globe2, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-main-900 text-main-50 pt-16 pb-8 border-t-4 border-main-500">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2 text-main-50">
            <Globe2 size={32} className="text-main-300" />
            <span className="font-heading font-bold text-2xl tracking-tight">O.G. Agency</span>
          </Link>
          <p className="text-small text-secondary-100 mt-2">
            Modernizing global employment. Secure, transparent, and efficient visa processing & manpower recruitment.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-main-300 text-lg font-semibold mb-2">Quick Links</h4>
          <Link href="/about" className="text-secondary-100 hover:text-white transition-colors">About Us</Link>
          <Link href="/services" className="text-secondary-100 hover:text-white transition-colors">Our Services</Link>
          <Link href="/jobs" className="text-secondary-100 hover:text-white transition-colors">Job Portal</Link>
        </div>

        {/* Services */}
        <div className="flex flex-col gap-4">
          <h4 className="text-main-300 text-lg font-semibold mb-2">Our Services</h4>
          <span className="text-secondary-100">Foreign Employment</span>
          <span className="text-secondary-100">Visa Assistance</span>
          <span className="text-secondary-100">University Placements</span>
          <span className="text-secondary-100">Ticketing</span>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-4">
          <h4 className="text-main-300 text-lg font-semibold mb-2">Contact Us</h4>
          <div className="flex items-center gap-3 text-secondary-100">
            <Phone size={18} className="text-main-500" />
            <span>+94 123 456 789</span>
          </div>
          <div className="flex items-center gap-3 text-secondary-100">
            <Mail size={18} className="text-main-500" />
            <span>info@ogagency.com</span>
          </div>
          <div className="flex items-center gap-3 text-secondary-100">
            <MapPin size={18} className="text-main-500" />
            <span>Negombo, Western Province, Sri Lanka</span>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-main-700 pt-8 flex flex-col md:flex-row justify-between items-center text-small text-secondary-300">
        <p>&copy; {new Date().getFullYear()} O.G. Agency. All rights reserved.</p>
        <p>Developed by Group CS16</p>
      </div>
    </footer>
  );
}