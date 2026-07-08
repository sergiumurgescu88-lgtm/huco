import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, ChevronRight, Clock, Tag } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

// Datele evenimentelor de pe hocotech.com
const eventsData = [
  {
    id: 1,
    title: "HOCO.GAMING Official Launch",
    date: "21/04/2026",
    category: "Events",
    image: "https://hocotech.com/wp-content/uploads/2026/04/hoco-gaming-official-launch-banner.jpg",
    excerpt: "Official launch of HOCO.GAMING - premium gaming accessories line",
    content: "We are excited to announce the official launch of HOCO.GAMING, our new line of premium gaming accessories designed for professional gamers and enthusiasts."
  },
  {
    id: 2,
    title: "hoco. × Hong Kong Exhibition 2025 / October /",
    date: "29/09/2025",
    category: "Events",
    image: "https://hocotech.com/wp-content/uploads/2025/09/hoco-news-hk-exhibition-october-2025-banner.jpg",
    excerpt: "Join us at Hong Kong Exhibition October 2025",
    content: "Visit our booth at the Hong Kong Exhibition to discover our latest products and innovations."
  },
  {
    id: 3,
    title: "hoco. × Germany IFA Exhibition 2025",
    date: "05/09/2025",
    category: "Events",
    image: "https://hocotech.com/wp-content/uploads/2025/09/hoco-news-ifa-exhibition-germany-2025-banner.jpg",
    excerpt: "IFA 2025 - Berlin, Germany",
    content: "Hoco will be present at IFA 2025 in Berlin, showcasing our latest mobile accessories and smart home solutions."
  },
  {
    id: 4,
    title: "hoco. at Shenzhen International Gift Show",
    date: "25/04/2025",
    category: "Events",
    image: "https://hocotech.com/wp-content/uploads/2025/04/hoco-news-shenzhen-international-gift-show-2025-banner.jpg",
    excerpt: "Shenzhen International Gift Show 2025",
    content: "Discover Hoco's premium accessories at the Shenzhen International Gift Show."
  },
  {
    id: 5,
    title: "hoco. at Hong Kong Exhibition 2025",
    date: "18/04/2025",
    category: "Events",
    image: "https://hocotech.com/wp-content/uploads/2025/04/hoco-news-hong-kong-exhibition-2025-banner.jpg",
    excerpt: "Hong Kong Exhibition April 2025",
    content: "Join us at Hong Kong Exhibition to explore our newest product lineup."
  },
  {
    id: 6,
    title: "hoco. Landing Las Vegas CES Show",
    date: "07/01/2025",
    category: "Events",
    image: "https://hocotech.com/wp-content/uploads/2025/01/hoco-news-las-vegas-ces-show-2025-banner.jpg",
    excerpt: "CES 2025 - Las Vegas",
    content: "Hoco makes its mark at CES 2025 in Las Vegas, presenting cutting-edge mobile technology."
  },
  {
    id: 7,
    title: "hoco. Guangzhou Showroom Upgrade",
    date: "10/12/2024",
    category: "Events",
    image: "https://hocotech.com/wp-content/uploads/2024/12/hoco-news-guangzhou-showroom-upgrade-banner.jpg",
    excerpt: "New upgraded showroom in Guangzhou",
    content: "We are proud to announce the upgrade of our Guangzhou showroom with an enhanced customer experience."
  },
  {
    id: 8,
    title: "hoco. × Germany IFA Exhibition 2024",
    date: "06/09/2024",
    category: "Events",
    image: "https://hocotech.com/wp-content/uploads/2024/09/hoco-germany-ifa-exhibition-invites-banner.jpg",
    excerpt: "IFA 2024 - Berlin",
    content: "Hoco at IFA 2024 - Discover our innovations in mobile accessories."
  },
  {
    id: 9,
    title: "hoco. 15th Anniversary Celebration",
    date: "26/01/2024",
    category: "Events",
    image: "https://hocotech.com/wp-content/uploads/2024/01/hoco-news-15th-anniversary-celebration-banner-en.jpg",
    excerpt: "Celebrating 15 years of excellence",
    content: "Hoco celebrates 15 years of providing premium mobile accessories worldwide."
  },
  {
    id: 10,
    title: "hoco. Malaysia Grand Opening",
    date: "05/01/2024",
    category: "Events",
    image: "https://hocotech.com/wp-content/uploads/2024/01/hoco-news-malaysia-grand-opening-banner.jpg",
    excerpt: "Grand opening in Malaysia",
    content: "Hoco expands to Malaysia with a grand opening event."
  }
];

const NewsCard = ({ event, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border-2 border-transparent hover:border-red-600"
  >
    <div className="aspect-video overflow-hidden bg-gray-100 relative">
      <img 
        src={event.image} 
        alt={event.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/800x450/DC2626/FFFFFF?text=Hoco+News';
        }}
      />
      <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold">
        {event.category}
      </div>
    </div>
    
    <div className="p-6">
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-red-600" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Tag size={16} className="text-red-600" />
          <span>{event.category}</span>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
        {event.title}
      </h3>
      
      <p className="text-gray-600 mb-4 line-clamp-2">{event.excerpt}</p>
      
      <button className="inline-flex items-center gap-2 text-red-600 font-bold hover:underline">
        READ MORE <ArrowRight size={18} />
      </button>
    </div>
  </motion.div>
);

export default function NewsPage() {
  const [filter, setFilter] = useState("All");
  
  const categories = ["All", ...new Set(eventsData.map(e => e.category))];
  const filteredEvents = filter === "All" 
    ? eventsData 
    : eventsData.filter(e => e.category === filter);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-black text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/30 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-4">NEWS & EVENTS</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Stay updated with the latest from Hoco Romania - Official Partner
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-3 rounded-full font-bold transition-all ${
                  filter === cat 
                    ? 'bg-red-600 text-white shadow-lg' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, idx) => (
              <NewsCard key={event.id} event={event} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Official Partner Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-black mb-6">OFFICIAL PARTNER</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Hoco Romania is an official partner of Hoco.tech, bringing you the latest 
            innovations and premium mobile accessories directly from the source.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all"
          >
            EXPLORE PRODUCTS <ArrowRight size={24} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
