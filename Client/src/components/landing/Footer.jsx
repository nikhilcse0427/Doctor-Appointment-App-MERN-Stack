import React from 'react'
import { Link } from 'react-router-dom'
import {Copyright, Phone, Mail, MapPin} from 'lucide-react'
const Footer = () => {
  return (
    <>
      <footer className="bg-blue-900 text-white py-10 mt-10">
  <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

    {/* Logo & Description */}
    <div>
      <h2 className="text-2xl font-bold mb-3">Narayana+</h2>
      <p className="text-gray-300 text-sm leading-relaxed">
        Your trusted platform for instant doctor appointments, 24/7 consultations,
        and expert medical guidance — anytime, anywhere.
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
      <ul className="space-y-2 text-gray-300 text-sm">
        <li><a href="#" className="hover:text-white">Home</a></li>
        <li><a href="#" className="hover:text-white">Find Doctors</a></li>
        <li><a href="#" className="hover:text-white">Login</a></li>
        <li><a href="#" className="hover:text-white">Register</a></li>
      </ul>
    </div>

    {/* Support */}
    <div>
      <h3 className="font-semibold text-lg mb-3">Support</h3>
      <ul className="space-y-2 text-gray-300 text-sm">
        <li><a href="#" className="hover:text-white">FAQs</a></li>
        <li><a href="#" className="hover:text-white">Help Center</a></li>
        <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
        <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
      </ul>
    </div>

    {/* Contact Info */}
    <div>
      <h3 className="font-semibold text-lg mb-3">Contact Us</h3>
      <ul className="space-y-2 text-gray-300 text-sm">
        <li>Email: support@narayana.com</li>
        <li>Phone: +91 98765 43210</li>
        <li>Address: Delhi, India</li>
      </ul>
    </div>
  </div>

  {/* Bottom Bar */}
  <div className="mt-10 border-t border-gray-700 pt-4 text-center text-gray-400 text-sm">
    © {new Date().getFullYear()} Narayana+. All rights reserved.
  </div>
</footer>

    </>
  )
}

export default Footer
