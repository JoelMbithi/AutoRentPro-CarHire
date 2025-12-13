"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Phone, Mail, Star, MapPin, Award, Clock, Users, 
  BadgeCheck, Calendar, Car, MessageSquare, Share2, 
  ChevronRight, Filter, Search, X, Loader2 
} from 'lucide-react';
import { AgentsProps } from '../types';
import { useRouter } from 'next/navigation';

const stats = [
  { number: '5,000+', label: 'Happy Customers', icon: Users },
  { number: '98%', label: 'Satisfaction Rate', icon: Star },
  { number: '24/7', label: 'Support Available', icon: Clock },
  { number: '15min', label: 'Avg. Response Time', icon: Award }
];

const OurAgents = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true); 
  const [agents, setAgents] = useState<AgentsProps[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<AgentsProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('All');

  // Fetch agents from API only
  const fetchAgents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const controller = new AbortController();
   /*    const timeoutId = setTimeout(() => controller.abort(), 5000); */
      
      const response = await fetch("/features/Car-Agents/api/agents", {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
  /*     clearTimeout(timeoutId); */
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Handle different response formats
      let agentsData: AgentsProps[] = [];
      
      if (Array.isArray(data)) {
        agentsData = data;
      } else if (data && Array.isArray(data.agents)) {
        agentsData = data.agents;
      } else if (data && Array.isArray(data.data)) {
        agentsData = data.data;
      } else {
        throw new Error('Invalid data format received from server');
      }
      
      if (agentsData.length === 0) {
        throw new Error('No agents available');
      }
      
      setAgents(agentsData);
      setFilteredAgents(agentsData);
      
    } catch (error) {
      console.error("Error fetching agents:", error);
      setError(error instanceof Error ? error.message : 'Failed to load agents. Please try again.');
      // NO FALLBACK - keep arrays empty
      setAgents([]);
      setFilteredAgents([]);
    } finally {
      setLoading(false);
    }
  };

  // Extract unique specialties and locations for filters
  const allSpecialties = Array.from(
    new Set(agents.flatMap(agent => agent.specialties || []))
  );
  
  const allLocations = ['All', ...Array.from(
    new Set(agents.map(agent => agent.location?.split(',')[0] || 'Unknown').filter(Boolean))
  )];

  // Apply filters
  useEffect(() => {
    if (agents.length === 0) {
      setFilteredAgents([]);
      return;
    }
    
    let result = agents;
    
    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(agent =>
        agent.name.toLowerCase().includes(term) ||
        agent.role.toLowerCase().includes(term) ||
        agent.bio.toLowerCase().includes(term)
      );
    }
    
    // Specialty filter
    if (selectedSpecialties.length > 0) {
      result = result.filter(agent =>
        selectedSpecialties.some(specialty => 
          agent.specialties.includes(specialty)
        )
      );
    }
    
    // Location filter
    if (selectedLocation !== 'All') {
      result = result.filter(agent =>
        agent.location.startsWith(selectedLocation)
      );
    }
    
    setFilteredAgents(result);
  }, [agents, searchTerm, selectedSpecialties, selectedLocation]);

  // Handle agent click
  const handleAgentClick = (agentId: number) => {
    router.push(`/features/Car-Agents/components/agents/${agentId}`);
  };

  // Handle contact click
  const handleContactClick = (agent: AgentsProps, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/contact?agent=${agent.id}&name=${encodeURIComponent(agent.name)}`);
  };

  // Share agent profile
  const handleShare = (agent: AgentsProps, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `${agent.name} - AutoRent Pro Agent`,
        text: `Check out ${agent.name}'s profile on AutoRent Pro`,
        url: `${window.location.origin}/features/Car-Agents/api/agents/${agent.id}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/features/Car-Agents/api/agents/${agent.id}`);
      alert('Profile link copied to clipboard!');
    }
  };

  // Toggle specialty filter
  const toggleSpecialty = (specialty: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedSpecialties([]);
    setSelectedLocation('All');
  };

  // Initialize - fetch data on component mount
  useEffect(() => {
    fetchAgents();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">Loading our expert team...</p>
          <p className="text-gray-400 text-sm mt-2">Fetching the best car rental specialists</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Unable to Load Agents</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={fetchAgents}
              className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="block text-center text-gray-600 hover:text-gray-900 font-medium py-2"
            >
              ← Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      {/* Enhanced Hero Section */}
      <section className="relative text-white py-40 overflow-hidden bg-cover bg-center" 
        style={{ backgroundImage: "url('/Agents.png')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/40 to-transparent"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full mix-blend-overlay animate-pulse"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-white/20">
              <Award className="w-4 h-4 text-orange-300" />
              <span className="text-sm font-semibold">KENYA'S MOST TRUSTED CAR RENTAL TEAM</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-yellow-200">Expert Agents</span>
            </h1>
            
            <p className="text-xl lg:text-2xl opacity-90 mb-8 leading-relaxed max-w-3xl">
              Professional car rental specialists dedicated to making your journey seamless, 
              comfortable, and memorable across Kenya.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-2xl">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-left group">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-orange-300" />
                      </div>
                      <div>
                        <div className="text-2xl lg:text-3xl font-bold text-orange-300 group-hover:scale-105 transition-transform duration-300">
                          {stat.number}
                        </div>
                        <div className="text-white/80 text-sm font-medium">{stat.label}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      {agents.length > 0 && (
        <section className="py-8 bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search agents by name, role, or expertise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Filter by:</span>
                </div>
                
                {/* Location Filter */}
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {allLocations.map(location => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                
                {/* Active Filters Display */}
                {(selectedSpecialties.length > 0 || selectedLocation !== 'All') && (
                  <button
                    onClick={resetFilters}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
                  >
                    Clear filters
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Specialty Filter Chips */}
            {allSpecialties.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {allSpecialties.map(specialty => (
                  <button
                    key={specialty}
                    onClick={() => toggleSpecialty(specialty)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedSpecialties.includes(specialty)
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {specialty}
                    {selectedSpecialties.includes(specialty) && (
                      <X className="w-3 h-3 ml-2 inline" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Enhanced Agents Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                  Our Professional Team
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl">
                  {filteredAgents.length} expert{filteredAgents.length !== 1 ? 's' : ''} found
                  {selectedLocation !== 'All' && ` in ${selectedLocation}`}
                </p>
              </div>
              
              {agents.length > 0 && (
                <div className="hidden lg:block">
                  <Link 
                    href="/agents/schedule"
                    className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <Calendar className="w-5 h-5" />
                    Schedule Consultation
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {filteredAgents.length === 0 ? (
            <div className="text-center py-20">
              {agents.length === 0 ? (
                <>
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">No Agents Available</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    There are currently no agents available. Please check back later.
                  </p>
                  <button
                    onClick={fetchAgents}
                    className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                  >
                    Refresh
                  </button>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">No Agents Found</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Try adjusting your search terms or filters to find what you're looking for.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                  >
                    Clear All Filters
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {filteredAgents.map(agent => (
                  <div
                    key={agent.id}
                    onClick={() => handleAgentClick(agent.id)}
                    className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-orange-200 hover:-translate-y-2 cursor-pointer"
                  >
                    {/* Agent Header with Image */}
                    <div className="relative">
                      <div className="w-full h-72 bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
                        <Image
                          src={agent.image}
                          alt={agent.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          priority={agent.id <= 3}
                        />
                        {/* Image Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                      
                      {/* Quick Actions Overlay */}
                      <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={(e) => handleShare(agent, e)}
                          className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                          title="Share profile"
                        >
                          <Share2 className="w-4 h-4 text-gray-700" />
                        </button>
                        <button
                          onClick={(e) => handleContactClick(agent, e)}
                          className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-orange-600 transition-colors"
                          title="Contact agent"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Agent Details */}
                    <div className="p-8">
                      <div className="mb-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-1 hover:text-orange-600 transition-colors">
                              {agent.name}
                            </h2>
                            <p className="text-orange-600 font-semibold mb-3">{agent.role}</p>
                          </div>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            Joined {agent.joined}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{agent.bio}</p>
                      </div>

                      {/* Specialties */}
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">SPECIALTIES</h3>
                        <div className="flex flex-wrap gap-2">
                          {agent.specialties.slice(0, 3).map((specialty, index) => (
                            <span
                              key={index}
                              className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium"
                            >
                              {specialty}
                            </span>
                          ))}
                          {agent.specialties.length > 3 && (
                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                              +{agent.specialties.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-800">{agent.reviews}+</div>
                          <div className="text-xs text-gray-500">Bookings</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-800">
                            {agent.responseTime.split(' ')[0]}
                          </div>
                          <div className="text-xs text-gray-500">Response</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-800">
                            {agent.languages.length}
                          </div>
                          <div className="text-xs text-gray-500">Languages</div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContactClick(agent, e);
                          }}
                          className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Contact Agent
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAgentClick(agent.id);
                          }}
                          className="w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 group"
                          title="View full profile"
                        >
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* View More Button */}
              <div className="text-center mt-12">
                <Link
                  href="/agents/all"
                  className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold text-lg group"
                >
                  View all {agents.length} agents
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 via-orange-500 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48 animate-pulse"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  Need Personalized Car Rental Assistance?
                </h2>
                <p className="text-xl opacity-90 mb-8 leading-relaxed">
                  Let our expert team match you with the perfect vehicle and create a 
                  customized rental plan for your Kenyan adventure.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Car className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Wide Vehicle Selection</h4>
                      <p className="opacity-90">From economy cars to luxury SUVs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">24/7 Support</h4>
                      <p className="opacity-90">Round-the-clock assistance available</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Best Price Guarantee</h4>
                      <p className="opacity-90">Competitive rates with no hidden fees</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-6">Get Expert Advice</h3>
                
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => window.location.href = 'tel:+254743861565'}
                      className="flex-1 bg-white text-orange-600 hover:bg-gray-50 font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl flex items-center justify-center gap-3 group"
                    >
                      <Phone className="w-5 h-5" />
                      Call Our Team
                      <span className="text-sm font-normal">+254 743 861 565</span>
                    </button>
                    
                    <button 
                      onClick={() => window.location.href = 'mailto:support@autorentpro.com'}
                      className="flex-1 border-2 border-white text-white hover:bg-white hover:text-orange-600 font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm flex items-center justify-center gap-3"
                    >
                      <Mail className="w-5 h-5" />
                      Email Experts
                    </button>
                  </div>
                  
                  <div className="pt-6 border-t border-white/20">
                    <p className="flex items-center justify-center gap-3 text-lg mb-4">
                      <Clock className="w-5 h-5 text-orange-300" />
                      Average response time: <strong className="text-white ml-1">Under 15 minutes</strong>
                    </p>
                    
                    <Link
                      href="/contact"
                      className="block text-center bg-transparent border-2 border-white/30 hover:border-white text-white font-medium py-3 rounded-xl transition-all duration-300 hover:bg-white/10"
                    >
                      Or send us a message →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurAgents;