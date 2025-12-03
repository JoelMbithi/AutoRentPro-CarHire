import React from 'react';
import Image from 'next/image';
import { Phone, Mail, Star, MapPin, Award, Clock, Users, BadgeCheck } from 'lucide-react';

const agents = [
  {
    id: 1,
    name: 'John Mwangi',
    role: 'Senior Car Hire Agent',
    rating: 4.9,
    reviews: 127,
    image: '/Profiles/agent1.jpg',
    phone: '+254 712 345 678',
    email: 'john@autorentpro.com',
    location: 'Nairobi, Kenya',
    bio: 'Over 6 years of experience in vehicle rentals, customer service, and corporate bookings.',
    specialties: ['Luxury Vehicles', 'Corporate Accounts', 'Long-term Rentals'],
    languages: ['English', 'Swahili'],
    responseTime: 'Under 15 minutes',
    joined: '2018'
  },
  {
    id: 2,
    name: 'Sarah Nduku',
    role: 'Customer Support Specialist',
    rating: 4.8,
    reviews: 89,
    image: '/Profiles/agent2.jpg',
    phone: '+254 723 987 654',
    email: 'sarah@autorentpro.com',
    location: 'Mombasa, Kenya',
    bio: 'Dedicated to ensuring customer satisfaction with quick and reliable assistance.',
    specialties: ['Family Vehicles', 'Airport Pickups', 'Tourist Packages'],
    languages: ['English', 'Swahili', 'French'],
    responseTime: 'Under 10 minutes',
    joined: '2020'
  },
  {
    id: 3,
    name: 'Kevin Otieno',
    role: 'Fleet Manager',
    rating: 5.0,
    reviews: 156,
    image: '/Profiles/agent3.jpg',
    phone: '+254 701 234 567',
    email: 'kevin@autorentpro.com',
    location: 'Kisumu, Kenya',
    bio: 'Expert in vehicle inspection, maintenance, and   AutoRent Pro car rental advisory.',
    specialties: ['4WD & Safari Vehicles', 'Fleet Management', 'Vehicle Inspection'],
    languages: ['English', 'Swahili', 'Luo'],
    responseTime: 'Under 20 minutes',
    joined: '2017'
  }
];

const stats = [
  { number: '5,000+', label: 'Happy Customers' },
  { number: '98%', label: 'Satisfaction Rate' },
  { number: '24/7', label: 'Support Available' },
  { number: '15min', label: 'Avg. Response Time' }
];

const OurAgents = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      {/* Enhanced Hero Section */}
      <section className="relative text-white py-24 overflow-hidden bg-fit bg-center" 
  style={{ backgroundImage: "url('/discussion1.png')" }}>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full mix-blend-overlay animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-white/3 rounded-full mix-blend-overlay animate-pulse delay-1000"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-white/20">
              <Award className="w-4 h-4 text-orange-300" />
              <span className="text-sm font-semibold">KENYA'S MOST TRUSTED CAR RENTAL TEAM</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-yellow-200">Expert Agents</span>
            </h1>
            
            <p className="text-xl lg:text-2xl opacity-90 mb-8 leading-relaxed max-w-3xl mx-auto">
              Professional car rental specialists dedicated to making your journey seamless, 
              comfortable, and memorable across Kenya.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-2xl mx-auto mt-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="text-2xl lg:text-3xl font-bold text-orange-300 mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-white/80 text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Agents Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Our Professional Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Each agent brings unique expertise and local knowledge to ensure your car rental 
              experience exceeds expectations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {agents.map(agent => (
              <div
                key={agent.id}
                className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-orange-200 hover:-translate-y-2"
              >
                {/* Agent Header with Image */}
                <div className="relative">
                  <div className="w-full h-72 bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
                    <Image
                      src={agent.image}
                      alt={agent.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Verified Badge */}
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                    <BadgeCheck className="w-4 h-4" />
                    Verified
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        <span className="font-bold text-gray-800">{agent.rating}</span>
                      </div>
                      <span className="text-gray-600 text-sm">({agent.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Agent Details */}
                <div className="p-8">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">{agent.name}</h2>
                    <p className="text-orange-600 font-semibold mb-3">{agent.role}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{agent.bio}</p>
                  </div>

                  {/* Specialties */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">SPECIALTIES</h3>
                    <div className="flex flex-wrap gap-2">
                      {agent.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Phone className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Phone</div>
                        <div className="font-semibold">{agent.phone}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Mail className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="font-semibold text-sm">{agent.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Location</div>
                        <div className="font-semibold">{agent.location}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Clock className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Response Time</div>
                        <div className="font-semibold">{agent.responseTime}</div>
                      </div>
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">LANGUAGES</h3>
                    <div className="flex gap-2">
                      {agent.languages.map((language, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-xs font-medium"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                      Contact Agent
                    </button>
                    <button className="w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105">
                      <Users className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-purple-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Need Personalized Assistance?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Our expert team is ready to help you choose the perfect vehicle, arrange corporate 
              fleet solutions, or plan your entire Kenyan adventure.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="bg-white text-orange-600 hover:bg-gray-50 font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl flex items-center gap-3">
                <Phone className="w-5 h-5" />
                Call Our Team
                <span className="text-sm font-normal">+254 743 861 565</span>
              </button>
              
              <button className="border-2 border-white text-white hover:bg-white hover:text-orange-600 font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm flex items-center gap-3">
                <Mail className="w-5 h-5" />
                Email Experts
              </button>
            </div>

            <div className="mt-8 text-white/80">
              <p className="flex items-center justify-center gap-2 text-lg">
                <Clock className="w-5 h-5 text-orange-300" />
                Average response time: <strong className="text-white ml-1">Under 15 minutes</strong>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurAgents;