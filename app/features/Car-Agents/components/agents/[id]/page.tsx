"use client"
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Phone, Mail, Star, MapPin, Award, Clock, Shield,
  BadgeCheck, Calendar, Car, MessageSquare, ChevronLeft,
  CheckCircle, Users, FileText, PhoneCall, MessageCircle,
  Building, Car as CarIcon, Wrench, Globe,
  Sparkles, Target, TrendingUp, ThumbsUp, Zap
} from 'lucide-react';
import { AgentsProps } from '../../../types';

interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

const SingleAgentPage = () => {
  const params = useParams();
  const router = useRouter();
  const [agent, setAgent] = useState<AgentsProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedAgents, setRelatedAgents] = useState<AgentsProps[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'services' | 'contact'>('overview');
  const [error, setError] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [sending,setSending] = useState(false)

  // Sample reviews data (in a real app, this would come from API)
  const reviews: Review[] = [
    {
      id: 1,
      name: 'David Kimani',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Joel helped me find the perfect 4WD for our family safari. Professional service and great advice!',
      verified: true
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      rating: 5,
      date: '1 month ago',
      comment: 'Exceptional service! Joel arranged our luxury vehicle rental with all the amenities we needed.',
      verified: true
    },
    {
      id: 3,
      name: 'Mohammed Ali',
      rating: 4,
      date: '3 months ago',
      comment: 'Very knowledgeable about vehicle specifications. Got exactly what we needed for our business trip.',
      verified: true
    }
  ];

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!params.id) {
          setError('Agent ID not found');
          return;
        }
        
        // Try multiple possible API endpoints
        const endpoints = [
         
          `/features/Car-Agents/api/agents/${params.id}`
        ];
        
        let response = null;
        for (const endpoint of endpoints) {
          try {
            const res = await fetch(endpoint);
            if (res.ok) {
              response = res;
              break;
            }
          } catch (e) {
            continue;
          }
        }
        
        if (!response) {
          throw new Error('Unable to connect to server');
        }
        
        const data = await response.json();
        const agentData = data.agent || data;
        
        if (agentData && agentData.id) {
          setAgent(agentData);
          
          // Fetch related agents
          try {
            const relatedRes = await fetch('/api/agents');
            if (relatedRes.ok) {
              const allAgents = await relatedRes.json();
              const agentsArray = Array.isArray(allAgents) ? allAgents : allAgents.agents || [];
              
              const filtered = agentsArray
                .filter((a: AgentsProps) => a.id !== agentData.id)
                .slice(0, 3);
              
              setRelatedAgents(filtered);
            }
          } catch (e) {
            console.log('Could not load related agents');
          }
        } else {
          throw new Error('Invalid agent data received');
        }
      } catch (error) {
        console.error('Error fetching agent:', error);
        setError(error instanceof Error ? error.message : 'Failed to load agent profile');
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [params.id]);

  // Professional fallback agent data
  const fallbackAgent: AgentsProps = {
    id: 7,
    name: 'Joel Mbithi',
    role: 'Senior Fleet Manager',
    rating: 4.9,
    reviews: 156,
    image: '/Profiles/agent3.png',
    phone: '+254 743 861 565',
    email: 'joel@autorentpro.com',
    location: 'Nairobi, Kenya',
    bio: 'With over 8 years of experience in the automotive rental industry, Joel specializes in fleet management, luxury vehicle rentals, and safari tour coordination. He has helped over 500 clients find their perfect vehicles for business and leisure.',
    specialties: ['4WD & Safari Vehicles', 'Luxury Fleet Management', 'Corporate Accounts', 'Vehicle Inspection'],
    languages: ['English', 'Swahili', 'Kamba'],
    responseTime: 'Within 15 minutes',
    joined: '2018'
  };

  const displayAgent = agent || fallbackAgent;

  // Professional stats
  const agentStats = [
    { label: 'Response Rate', value: '98%', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Client Satisfaction', value: `${displayAgent.rating}/5`, icon: ThumbsUp, color: 'text-orange-600' },
    { label: 'Bookings Managed', value: `${displayAgent.reviews}+`, icon: Target, color: 'text-blue-600' },
    { label: 'Years Experience', value: '8+', icon: Award, color: 'text-purple-600' },
  ];

  // Services offered
  const services = [
    { icon: CarIcon, title: 'Vehicle Selection', description: 'Find the perfect vehicle for your needs' },
    { icon: Shield, title: 'Insurance Guidance', description: 'Comprehensive insurance advice' },
    { icon: Users, title: 'Corporate Accounts', description: 'Business fleet management' },
    { icon: Wrench, title: 'Maintenance Support', description: 'Vehicle maintenance and support' },
    { icon: Globe, title: 'Tour Planning', description: 'Safari and tour coordination' },
    { icon: FileText, title: 'Paperwork Handling', description: 'All documentation handled' },
  ];

  //handle submit Message
  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSending(true)

    const formData = {
      name: (e.currentTarget.elements.namedItem('name') as HTMLInputElement).value,
    email: (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value,
    phone: (e.currentTarget.elements.namedItem('phone') as HTMLInputElement).value,
    message: (e.currentTarget.elements.namedItem('message') as HTMLTextAreaElement).value,
    subject: `Inquiry for ${displayAgent.name}`,
    rentalType: (e.currentTarget.elements.namedItem('rentalType') as HTMLSelectElement)?.value || 'General',
    }
    try {
      const response = await fetch(`/features/Car-Agents/api/agents/${params.id}/Contact_Agents`,{
        method:'POST',
        headers: {
          'Content-Type':'application/json',

        },
        body:JSON.stringify(formData)
      })

      const data = await response.json()

      if(response.ok){
         alert(' Message sent successfully! The agent will contact you shortly.');
      setShowContactForm(false);
      }else {
      alert(` Error: ${data.error || 'Failed to send message'}`);
    }
    } catch (error) {
       console.error('Error sending message:', error);
    alert(' Network error. Please try again.');
    }finally {
    setSending(false);
  }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Car className="w-8 h-8 text-orange-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-gray-700 font-medium">Loading professional profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-gray-400 text-2xl">!</div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-3">Profile Unavailable</h3>
            <p className="text-gray-600 text-center mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Try Again
              </button>
              <Link
                href="/agents"
                className="block text-center text-gray-600 hover:text-gray-900 font-medium py-2"
              >
                ← Browse All Agents
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Professional Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link
                href="/agents"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                <span className="font-medium">Back to Agents</span>
              </Link>
              <div className="hidden md:block">
                <span className="text-sm text-gray-500">AutoRent Pro</span>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-sm font-medium text-gray-700">Professional Agent</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowContactForm(true)}
                className="hidden md:inline-flex items-center bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact
              </button>
              <button
                onClick={() => window.location.href = `tel:${displayAgent.phone}`}
                className="inline-flex items-center bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium text-sm"
              >
                <PhoneCall className="w-4 h-4 mr-2" />
                Call Now
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Hero Section - Professional Layout */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Left Column - Profile */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={displayAgent.image}
                      alt={displayAgent.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                    <BadgeCheck className="w-3 h-3 mr-1" />
                    Verified
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">{displayAgent.name}</h1>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className="text-gray-700 font-medium">{displayAgent.role}</span>
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-orange-500 fill-current" />
                          <span className="ml-1 font-semibold text-gray-900">{displayAgent.rating}</span>
                          <span className="ml-1 text-gray-500">({displayAgent.reviews} reviews)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => window.location.href = `tel:${displayAgent.phone}`}
                        className="flex items-center bg-gray-900 text-white px-4 py-2.5 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </button>
                      <button
                        onClick={() => setShowContactForm(true)}
                        className="flex items-center border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-wrap gap-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {displayAgent.location}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      Response: {displayAgent.responseTime}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Building className="w-4 h-4 mr-2" />
                      Member since {displayAgent.joined}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bio */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Background</h2>
                <p className="text-gray-600 leading-relaxed">{displayAgent.bio}</p>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {agentStats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className={`${stat.color} mb-2 flex justify-center`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-500">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
              
              {/* Languages */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Languages Spoken</h3>
                <div className="flex flex-wrap gap-2">
                  {displayAgent.languages.map((language, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Quick Info */}
          <div className="lg:w-1/3">
            <div className="sticky top-24 space-y-6">
              {/* Contact Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                      <Phone className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <a 
                        href={`tel:${displayAgent.phone}`}
                        className="text-gray-900 font-medium hover:text-orange-600 transition-colors"
                      >
                        {displayAgent.phone}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                      <Mail className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <a 
                        href={`mailto:${displayAgent.email}`}
                        className="text-gray-900 font-medium hover:text-orange-600 transition-colors"
                      >
                        {displayAgent.email}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                      <MapPin className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Location</div>
                      <div className="text-gray-900 font-medium">{displayAgent.location}</div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full mt-6 bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center justify-center"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Send Message
                </button>
              </div>
              
              {/* Availability */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-medium text-gray-900">8:00 AM - 7:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-medium text-gray-900">9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-medium text-gray-900">10:00 AM - 4:00 PM</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-center text-green-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Available for consultation now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {['overview', 'services', 'reviews', 'contact'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 px-1 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="mb-12">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Specializations</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {displayAgent.specialties.map((specialty, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-orange-300 transition-colors">
                    <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mb-4">
                      <Car className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{specialty}</h3>
                    <p className="text-gray-600">
                      Expert consultation and comprehensive solutions for {specialty.toLowerCase()}.
                    </p>
                  </div>
                ))}
              </div>
              
              {/* Services Grid */}
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Services Offered</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-gray-700" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{service.title}</h3>
                        <p className="text-gray-600 text-sm">{service.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {activeTab === 'services' && (
            <div className="space-y-8">
              {displayAgent.specialties.map((specialty, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mr-4">
                      <Car className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{specialty}</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">What's Included</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Personalized vehicle selection
                        </li>
                        <li className="flex items-center text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Comprehensive insurance options
                        </li>
                        <li className="flex items-center text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          24/7 roadside assistance
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Pricing</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-gray-900 mb-1">From $85/day</div>
                        <p className="text-gray-600 text-sm">Custom rates available for long-term rentals</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Client Reviews</h2>
                  <p className="text-gray-600 mt-1">What clients say about working with {displayAgent.name.split(' ')[0]}</p>
                </div>
                <div className="flex items-center">
                  <div className="text-3xl font-bold text-gray-900 mr-2">{displayAgent.rating}</div>
                  <div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${star <= Math.floor(displayAgent.rating) ? 'text-orange-500 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <div className="text-gray-600 text-sm mt-1">{displayAgent.reviews} reviews</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                          <span className="font-medium text-gray-700">
                            {review.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium text-gray-900">{review.name}</h4>
                            {review.verified && (
                              <BadgeCheck className="w-4 h-4 text-green-500 ml-2" />
                            )}
                          </div>
                          <div className="flex items-center mt-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${star <= review.rating ? 'text-orange-500 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="text-gray-500 text-sm ml-2">{review.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 bg-gray-50 rounded-xl p-6 text-center">
                <h3 className="font-medium text-gray-900 mb-2">Share Your Experience</h3>
                <p className="text-gray-600 mb-4">Help others by sharing your experience with {displayAgent.name.split(' ')[0]}</p>
                <button className="inline-flex items-center border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Write a Review
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'contact' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact {displayAgent.name.split(' ')[0]}</h2>
                <p className="text-gray-600 mb-8">Get in touch for personalized vehicle rental assistance</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Tell us about your vehicle needs..."
                    ></textarea>
                  </div>
                  
                  <button className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium">
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Related Agents */}
        {relatedAgents.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Other Professional Agents</h2>
                <p className="text-gray-600 mt-1">Explore more experts in our team</p>
              </div>
              <Link
                href="/agents"
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                View all →
              </Link>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {relatedAgents.map((relatedAgent) => (
                <Link
                  key={relatedAgent.id}
                  href={`/agents/${relatedAgent.id}`}
                  className="group"
                >
                  <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-orange-300 transition-colors">
                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 mr-4">
                        <Image
                          src={relatedAgent.image}
                          alt={relatedAgent.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                          {relatedAgent.name}
                        </h3>
                        <p className="text-gray-600 text-sm">{relatedAgent.role}</p>
                        <div className="flex items-center mt-1">
                          <Star className="w-4 h-4 text-orange-500 fill-current" />
                          <span className="ml-1 text-sm font-medium text-gray-900">{relatedAgent.rating}</span>
                          <span className="ml-1 text-sm text-gray-500">({relatedAgent.reviews})</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {relatedAgent.specialties.slice(0, 2).map((specialty, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="text-sm text-gray-500">© {new Date().getFullYear()} AutoRent Pro. All rights reserved.</div>
              <div className="text-xs text-gray-400 mt-1">Professional Vehicle Rental Services</div>
            </div>
            <div className="flex items-center space-x-6">
              <a href="tel:+254743861565" className="text-gray-600 hover:text-gray-900 font-medium">
                +254 743 861 565
              </a>
              <a href="mailto:support@autorentpro.com" className="text-gray-600 hover:text-gray-900 font-medium">
                support@autorentpro.com
              </a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Contact Form Modal */}
   
    {showContactForm && (
      <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Contact {displayAgent.name.split(' ')[0]}</h3>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-gray-400 hover:text-gray-500"
                disabled={sending}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your name"
                  disabled={sending}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your email"
                  disabled={sending}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                  disabled={sending}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rental Type</label>
                <select
                  name="rentalType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  disabled={sending}
                >
                  <option value="General">General Inquiry</option>
                  <option value="Daily">Daily Rental</option>
                  <option value="Weekly">Weekly Rental</option>
                  <option value="Monthly">Monthly Rental</option>
                  <option value="Safari">Safari Package</option>
                  <option value="Corporate">Corporate Fleet</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Tell us about your vehicle needs..."
                  disabled={sending}
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
              
              <p className="text-xs text-gray-500 text-center">
                Your message will be sent to {displayAgent.name} and saved in our system.
              </p>
            </form>
          </div>
        </div>
      </div>
    )}
  
    </div>
  );
};

export default SingleAgentPage;