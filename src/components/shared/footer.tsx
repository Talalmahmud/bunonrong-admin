"use client";

import { Instagram, Facebook, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 py-12 px-4">
      <div className="container mx-auto px-4 md:px-0 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Description */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">ShopMate</h2>
          <p className="text-sm text-slate-400">
            Your one-stop shop for electronics, fashion, home & more.
          </p>

          {/* Social Icons */}
          <div className="flex gap-3 mt-4">
            <a href="#" className="hover:text-white transition">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-white transition">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-white transition">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="hover:text-white transition">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="hover:text-white transition cursor-pointer">Home</li>
            <li className="hover:text-white transition cursor-pointer">Shop</li>
            <li className="hover:text-white transition cursor-pointer">
              About Us
            </li>
            <li className="hover:text-white transition cursor-pointer">
              Contact
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Customer Service
          </h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="hover:text-white transition cursor-pointer">FAQs</li>
            <li className="hover:text-white transition cursor-pointer">
              Shipping & Returns
            </li>
            <li className="hover:text-white transition cursor-pointer">
              Privacy Policy
            </li>
            <li className="hover:text-white transition cursor-pointer">
              Terms of Service
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Subscribe</h3>
          <p className="text-sm text-slate-400 mb-4">
            Get the latest updates and offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 rounded-lg border border-slate-700 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition w-full sm:w-auto"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-12 border-t border-slate-700 pt-6 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} ShopMate. All rights reserved.
      </div>
    </footer>
  );
}
