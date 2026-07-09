import { Mail, Phone, MapPin, Globe, ShoppingBag, Info } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Coloana 1: Despre */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
              <ShoppingBag size={20} /> hoco.store
            </h3>
            <p className="text-sm leading-relaxed mb-4">
              Distribuitor autorizat Hoco în România. Oferim accesorii premium pentru dispozitive mobile, audio și smart home. Calitate garantată și livrare rapidă.
            </p>
            <div className="flex gap-4 text-sm">
              <a href="#" className="hover:text-white transition flex items-center gap-1"><Globe size={16} /> Site Web</a>
              <a href="#" className="hover:text-white transition flex items-center gap-1"><Info size={16} /> Rețele Sociale</a>
            </div>
          </div>

          {/* Coloana 2: Link-uri Rapide */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Link-uri Rapide</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Despre Noi</a></li>
              <li><a href="#" className="hover:text-white transition">Termeni și Condiții</a></li>
              <li><a href="#" className="hover:text-white transition">Politica de Confidențialitate</a></li>
              <li><a href="#" className="hover:text-white transition">Returnări și Rambursări</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>

          {/* Coloana 3: Categorii */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Categorii Populare</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Căști Wireless</a></li>
              <li><a href="#" className="hover:text-white transition">Power Banks</a></li>
              <li><a href="#" className="hover:text-white transition">Cablu Încărcare</a></li>
              <li><a href="#" className="hover:text-white transition">Suporturi Auto</a></li>
              <li><a href="#" className="hover:text-white transition">Smart Watch</a></li>
            </ul>
          </div>

          {/* Coloana 4: Contact */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contactează-ne</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-1 text-red-500" />
                <span>București, Sector 1, Strada Exemplului Nr. 1</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-red-500" />
                <span>+40 700 000 000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-red-500" />
                <span>contact@hocoromania.store</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Hoco Romania Store. Toate drepturile rezervate.</p>
        </div>
      </div>
    </footer>
  );
}
