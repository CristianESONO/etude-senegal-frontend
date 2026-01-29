import { GraduationCap, Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  const links = {
    services: [
      { label: 'Étudier au Sénégal', href: '/etudier' },
      { label: 'Formalités', href: '/formalites' },
      { label: 'Se Loger', href: '/loger' },
      { label: 'Bourses d\'études', href: '#' },
    ],
    resources: [
      { label: 'Guide de l\'étudiant', href: '#' },
      { label: 'FAQ', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Témoignages', href: '#' },
    ],
    legal: [
      { label: 'Mentions légales', href: '#' },
      { label: 'Politique de confidentialité', href: '#' },
      { label: 'Conditions d\'utilisation', href: '#' },
      { label: 'Contact', href: 'mailto:lebadilassistance@gmail.com' },
    ],
  };

  const socialLinks = [
    { 
      icon: Facebook, 
      href: 'https://www.facebook.com/share/1anPDBY3AY/?mibextid=wwXIfr', 
      label: 'Facebook',
      target: '_blank',
      rel: 'noopener noreferrer'
    },
    { 
      icon: Instagram, 
      href: 'https://www.instagram.com/lebadil_services?igsh=dDkxNGRhZDJwdTdj', 
      label: 'Instagram',
      target: '_blank',
      rel: 'noopener noreferrer'
    },
    { 
      icon: Linkedin, 
      href: 'https://www.linkedin.com/company/le-badil/', 
      label: 'LinkedIn',
      target: '_blank',
      rel: 'noopener noreferrer'
    },
  ];

  const contactInfo = [
    {
      icon: MapPin,
      text: 'Dakar, Sénégal',
      href: 'https://maps.google.com/?q=Dakar,Senegal'
    },
    {
      icon: Phone,
      text: '+221 71 145 73 04',
      href: 'tel:+221711457304'
    },
    {
      icon: Mail,
      text: 'lebadilassistance@gmail.com',
      href: 'mailto:lebadilassistance@gmail.com'
    }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
                <GraduationCap className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold text-white">EtudeSénégal</span>
            </div>
            <p className="text-gray-400 mb-6">
              Votre guide complet pour étudier et vivre au Sénégal. Une initiative de Le Badil Services.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 p-2 rounded-lg hover:bg-gradient-to-br hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 hover:scale-105"
                    aria-label={social.label}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Services</h3>
            <ul className="space-y-3">
              {links.services.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="hover:text-blue-400 transition-colors flex items-center gap-2 group"
                  >
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Ressources</h3>
            <ul className="space-y-3">
              {links.resources.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href} 
                    className="hover:text-blue-400 transition-colors flex items-center gap-2 group"
                  >
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Contact</h3>
            <ul className="space-y-4">
              {contactInfo.map((contact) => {
                const Icon = contact.icon;
                return (
                  <li key={contact.text} className="flex items-start gap-3">
                    <Icon size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
                    <a 
                      href={contact.href} 
                      className="hover:text-blue-400 transition-colors hover:underline"
                      target={contact.href.startsWith('http') || contact.href.startsWith('mailto') ? '_blank' : undefined}
                      rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {contact.text}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Partnership Notice */}
        <div className="mb-8 p-4 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-xl border border-blue-800/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h4 className="text-white font-semibold mb-1">En partenariat avec</h4>
              <p className="text-blue-300 text-sm">Le Badil Services - Votre partenaire éducatif au Sénégal</p>
            </div>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/lebadil_services?igsh=dDkxNGRhZDJwdTdj" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
              >
                Suivez-nous sur Instagram
              </a>
              <a 
                href="https://www.linkedin.com/company/le-badil/" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} EtudeSénégal. Tous droits réservés.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Une initiative de Le Badil Services - RC SN DKR 2023 B 14321
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              {links.legal.map((link) => (
                <a 
                  key={link.label} 
                  href={link.href} 
                  className="hover:text-blue-400 transition-colors hover:underline"
                  target={link.href.startsWith('http') || link.href.startsWith('mailto') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}