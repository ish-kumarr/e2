import Link from 'next/link'
import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="relative bg-gray-900 text-gray-300 py-12">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Eventia */}
          <div>
            <div className="flex items-center mb-4">
              <Image 
            src="/assets/images/logo.svg"
            alt="Eventia Logo"
                width={200}
                height={200}
                className="mr-2 "

              />
            </div>
            <p className="text-sm">
              Your premier platform for discovering, creating, and managing unforgettable events.
            </p>
            <p className="text-sm mt-2 italic">"Where each event is celebrated."</p> {/* Tagline */}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/events" className="hover:text-white transition-colors">Browse Events</Link></li>
              <li><Link href="/create" className="hover:text-white transition-colors">Create Event</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li>Email: eventia.team@gmail.com</li>
              <li>Phone: +91 984578547</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/30 text-sm text-center pt-8">
          <p>&copy; {new Date().getFullYear()} Eventia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
