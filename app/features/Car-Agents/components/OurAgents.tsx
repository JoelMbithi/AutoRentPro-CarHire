import React from 'react';
import Image from 'next/image';
import { Phone, Mail, Star, MapPin } from 'lucide-react';

const agents = [
  {
    id: 1,
    name: 'John Mwangi',
    role: 'Senior Car Hire Agent',
    rating: 4.9,
    image: '/Profiles/agent1.jpg',
    phone: '+254 712 345 678',
    email: 'john@autorentpro.com',
    location: 'Nairobi, Kenya',
    bio: 'Over 6 years of experience in vehicle rentals, customer service, and corporate bookings.'
  },
  {
    id: 2,
    name: 'Sarah Nduku',
    role: 'Customer Support Specialist',
    rating: 4.8,
    image: '/Profiles/agent2.jpg',
    phone: '+254 723 987 654',
    email: 'sarah@autorentpro.com',
    location: 'Mombasa, Kenya',
    bio: 'Dedicated to ensuring customer satisfaction with quick and reliable assistance.'
  },
  {
    id: 3,
    name: 'Kevin Otieno',
    role: 'Fleet Manager',
    rating: 5.0,
    image: '/Profiles/agent3.jpg',
    phone: '+254 701 234 567',
    email: 'kevin@autorentpro.com',
    location: 'Kisumu, Kenya',
    bio: 'Expert in vehicle inspection, maintenance, and premium car rental advisory.'
  }
];

const OurAgents = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Meet Our Trusted Agents</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Our professional team is committed to delivering exceptional customer service and ensuring
          your car rental experience is smooth, reliable, and stress-free.
        </p>
      </section>

      {/* Agents Grid */}
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {agents.map(agent => (
          <div
            key={agent.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden"
          >
            <div className="relative w-full h-64 bg-gray-200">
              <Image
                src={agent.image}
                alt={agent.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800">{agent.name}</h2>
              <p className="text-orange-600 font-medium mb-2">{agent.role}</p>

              <div className="flex items-center gap-1 mb-3">
                <Star className="text-yellow-400 w-5 h-5" />
                <span className="text-gray-700 font-semibold">{agent.rating}</span>
              </div>

              <p className="text-gray-600 mb-4 text-sm">{agent.bio}</p>

              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <Phone size={18} className="text-orange-500" />
                <span>{agent.phone}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <Mail size={18} className="text-orange-500" />
                <span>{agent.email}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-700 mb-4">
                <MapPin size={18} className="text-orange-500" />
                <span>{agent.location}</span>
              </div>

              <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 rounded-lg transition-all">
                Contact Agent
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <section className="text-center mt-20">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Need Help Choosing a Car?</h2>
        <p className="text-lg text-gray-600 max-w-xl mx-auto mb-6">
          Our team is ready to assist you with recommendations, long-term hires, corporate rentals,
          and more.
        </p>
        <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg transition-all">
          Speak With an Expert
        </button>
      </section>
    </div>
  );
};

export default OurAgents;