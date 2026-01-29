import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  const links = {
    services: [
      { label: 'Étudier au Sénégal', href: '#' },
      { label: 'Formalités', href: '#' },
      { label: 'Se Loger', href: '#' },
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
      { label: 'Contact', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
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
              <span className="text-xl text-white">EtudeSénégal</span>
            </div>
            <p className="text-gray-400 mb-4">
              Votre guide complet pour étudier et vivre au Sénégal
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="bg-gray-800 p-2 rounded-lg hover:bg-blue-600 transition-colors"
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
            <h3 className="text-white mb-4">Services</h3>
            <ul className="space-y-2">
              {links.services.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-blue-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-white mb-4">Ressources</h3>
            <ul className="space-y-2">
              {links.resources.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-blue-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={18} className="text-blue-400 flex-shrink-0 mt-1" />
                <span>Dakar, Sénégal</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={18} className="text-blue-400 flex-shrink-0" />
                <span>+221 71 145 73 04</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={18} className="text-blue-400 flex-shrink-0" />
                <span>contact@etudesenegal.sn</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 EtudeSénégal. Tous droits réservés.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              {links.legal.map((link) => (
                <a key={link.label} href={link.href} className="hover:text-blue-400 transition-colors">
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
