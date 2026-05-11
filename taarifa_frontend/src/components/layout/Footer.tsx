import { Link } from 'react-router-dom';

// Define proper type for footer links
interface FooterLink {
  label: string;
  path: string;
  external?: boolean;
}

interface FooterSection {
  [key: string]: FooterLink[];
}

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks: FooterSection = {
    product: [
      { label: 'Salary Lookup', path: '/salary' },
      { label: 'Affordability Check', path: '/affordability' },
      { label: 'Compare Cities', path: '/compare' },
      { label: 'Career Advice', path: '/career' },
    ],
    company: [
      { label: 'About Us', path: '/about' },
      { label: 'Contact', path: '/contact' },
      { label: 'Careers', path: '/careers' },
      { label: 'Press', path: '/press' },
    ],
    resources: [
      { label: 'Blog', path: '/blog' },
      { label: 'FAQ', path: '/faq' },
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
    ],
    connect: [
      { label: 'Twitter', path: 'https://twitter.com', external: true },
      { label: 'LinkedIn', path: 'https://linkedin.com', external: true },
      { label: 'Facebook', path: 'https://facebook.com', external: true },
      { label: 'Instagram', path: 'https://instagram.com', external: true },
    ],
  };

  // Type guard to check if link is external
  const isExternalLink = (link: FooterLink): link is FooterLink & { external: true } => {
    return link.external === true;
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 011-1h3a1 1 0 011 1v1a1 1 0 001-1V4zm0 0v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6a2 2 0 00-2 2z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xl font-bold">Taarifa</span>
            </div>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Your comprehensive guide to salaries and cost of living across Tanzania. 
              Make informed career and relocation decisions with accurate, up-to-date data.
            </p>
            
            {/* Newsletter Signup */}
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-300 mb-2">Stay updated</p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {isExternalLink(link) ? (
                      <a
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white text-sm transition-colors"
                      >
                        {link.label}
                        <svg
                          className="w-3 h-3 inline-block ml-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-gray-400 hover:text-white text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { label: 'Occupations', value: '200+', icon: '💼' },
              { label: 'Cities Covered', value: '22', icon: '🏙️' },
              { label: 'Data Points', value: '1000+', icon: '📊' },
              { label: 'Monthly Users', value: '5000+', icon: '👥' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} Taarifa. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-500">
                Made with <span className="text-red-500">❤️</span> in Tanzania
              </span>
              <span className="text-gray-600 hidden sm:inline">|</span>
              <span className="text-gray-500 hidden sm:inline">
                Data updated: {new Date().toLocaleDateString('en-TZ', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;