"use client"
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Phone, Mail, Star, MapPin, Clock, BadgeCheck,
  Car, MessageSquare, ChevronLeft, CheckCircle,
  Users, FileText, Wrench, Globe, MessageCircle, PhoneCall, Building
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
  const [agent, setAgent] = useState<AgentsProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedAgents, setRelatedAgents] = useState<AgentsProps[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'services' | 'contact'>('overview');
  const [error, setError] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [sending, setSending] = useState(false);

  const reviews: Review[] = [
    { id: 1, name: 'David Kimani',   rating: 5, date: '2 weeks ago',  comment: 'Joel helped me find the perfect 4WD for our family safari. Professional service and great advice!', verified: true },
    { id: 2, name: 'Sarah Johnson',  rating: 5, date: '1 month ago',  comment: 'Exceptional service! Joel arranged our luxury vehicle rental with all the amenities we needed.', verified: true },
    { id: 3, name: 'Mohammed Ali',   rating: 4, date: '3 months ago', comment: 'Very knowledgeable about vehicle specifications. Got exactly what we needed for our business trip.', verified: true },
  ];

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!params.id) { setError('Agent ID not found'); return; }

        const res = await fetch(`/features/Car-Agents/api/agents/${params.id}`);
        if (!res.ok) throw new Error('Unable to connect to server');

        const data = await res.json();
        const agentData = data.agent || data;

        if (agentData?.id) {
          setAgent(agentData);
          try {
            const relatedRes = await fetch('/features/Car-Agents/api/agents');
            if (relatedRes.ok) {
              const all = await relatedRes.json();
              const arr = Array.isArray(all) ? all : all.agents || [];
              setRelatedAgents(arr.filter((a: AgentsProps) => a.id !== agentData.id).slice(0, 3));
            }
          } catch { /* silent */ }
        } else {
          throw new Error('Invalid agent data received');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load agent profile');
      } finally {
        setLoading(false);
      }
    };
    fetchAgent();
  }, [params.id]);

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
    bio: 'With over 8 years of experience in the automotive rental industry, Joel specialises in fleet management, luxury vehicle rentals, and safari tour coordination. He has helped over 500 clients find their perfect vehicles for business and leisure.',
    specialties: ['4WD & Safari Vehicles', 'Luxury Fleet Management', 'Corporate Accounts', 'Vehicle Inspection'],
    languages: ['English', 'Swahili', 'Kamba'],
    responseTime: 'Within 15 minutes',
    joined: '2018',
  };

  const displayAgent = agent || fallbackAgent;

  const services = [
    { icon: Car,         title: 'Vehicle Selection',   description: 'Find the right vehicle for your needs' },
    { icon: Users,       title: 'Corporate Accounts',  description: 'Business fleet management' },
    { icon: Wrench,      title: 'Maintenance Support', description: 'Vehicle maintenance and support' },
    { icon: Globe,       title: 'Tour Planning',        description: 'Safari and tour coordination' },
    { icon: FileText,    title: 'Paperwork Handling',  description: 'All documentation handled' },
  ];

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const formData = {
      name:        (e.currentTarget.elements.namedItem('name')       as HTMLInputElement).value,
      email:       (e.currentTarget.elements.namedItem('email')      as HTMLInputElement).value,
      phone:       (e.currentTarget.elements.namedItem('phone')      as HTMLInputElement).value,
      message:     (e.currentTarget.elements.namedItem('message')    as HTMLTextAreaElement).value,
      subject:     `Inquiry for ${displayAgent.name}`,
      rentalType:  (e.currentTarget.elements.namedItem('rentalType') as HTMLSelectElement)?.value || 'General',
    };
    try {
      const res  = await fetch(`/features/Car-Agents/api/agents/${params.id}/Contact_Agents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Message sent successfully! The agent will contact you shortly.');
        setShowContactForm(false);
      } else {
        alert(`Error: ${data.error || 'Failed to send message'}`);
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-orange-500 transition';
  const labelClass = 'block text-sm text-gray-700 mb-1';

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading profile…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="max-w-sm w-full border border-gray-200 rounded p-8 text-center">
          <p className="text-gray-900 font-medium mb-2">Profile Unavailable</p>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-gray-900 text-white py-2 px-5 rounded text-sm font-medium hover:bg-gray-800 transition-colors mb-3 w-full">
            Try Again
          </button>
          <Link href="/agents" className="block text-sm text-gray-500 hover:text-gray-800">← Browse All Agents</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/agents" className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Agents
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowContactForm(true)}
              className="hidden md:inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Message
            </button>
            <a
              href={`tel:${displayAgent.phone}`}
              className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-orange-700 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" /> Call Now
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* Profile section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-10">

          {/* Left — profile details */}
          <div className="lg:w-2/3">
            <div className="border border-gray-200 rounded p-4">

              {/* Name + photo */}
              <div className="flex flex-col sm:flex-row gap-5 mb-7">
                <div className="relative shrink-0 w-28 h-28 rounded overflow-hidden bg-gray-100">
                  <Image src={displayAgent.image} alt={displayAgent.name} fill className="object-cover" sizes="112px" />
                  <div className="absolute bottom-0 left-0 right-0 bg-green-600 text-white text-xs text-center py-0.5 flex items-center justify-center gap-1">
                    <BadgeCheck className="w-3 h-3" /> Verified
                  </div>
                </div>

                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">{displayAgent.name}</h1>
                  <p className="text-gray-500 text-sm mt-1">{displayAgent.role}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-4 h-4 text-orange-500 fill-current" />
                    <span className="text-sm font-medium text-gray-900">{displayAgent.rating}</span>
                    <span className="text-sm text-gray-400">({displayAgent.reviews} reviews)</span>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{displayAgent.location}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />Responds {displayAgent.responseTime}</span>
                    <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5" />Since {displayAgent.joined}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <a href={`tel:${displayAgent.phone}`} className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-800 transition-colors">
                      <Phone className="w-3.5 h-3.5" /> Call
                    </a>
                    <button onClick={() => setShowContactForm(true)} className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
                      <Mail className="w-3.5 h-3.5" /> Email
                    </button>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-7">
                <h2 className="text-base font-semibold text-gray-900 mb-2">About</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{displayAgent.bio}</p>
              </div>

              {/* Languages */}
              <div>
                <h3 className="text-sm text-gray-500 mb-2">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {displayAgent.languages.map((lang, i) => (
                    <span key={i} className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded">{lang}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right — contact + availability */}
          <div className="lg:w-1/3 space-y-4">

            {/* Contact card */}
            <div className="border border-gray-200 rounded p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Contact</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">Phone</p>
                  <a href={`tel:${displayAgent.phone}`} className="text-gray-900 font-medium hover:text-orange-600 transition-colors">{displayAgent.phone}</a>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">Email</p>
                  <a href={`mailto:${displayAgent.email}`} className="text-gray-900 font-medium hover:text-orange-600 transition-colors">{displayAgent.email}</a>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">Location</p>
                  <p className="text-gray-900 font-medium">{displayAgent.location}</p>
                </div>
              </div>
              <button
                onClick={() => setShowContactForm(true)}
                className="w-full mt-5 bg-orange-600 text-white py-2.5 rounded text-sm font-medium hover:bg-orange-700 transition-colors"
              >
                Send Message
              </button>
            </div>

            {/* Availability */}
            <div className="border border-gray-200 rounded p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Availability</h3>
              <div className="space-y-2 text-sm">
                {[
                  { day: 'Monday – Friday', hours: '8:00 AM – 7:00 PM' },
                  { day: 'Saturday',        hours: '9:00 AM – 5:00 PM' },
                  { day: 'Sunday',          hours: '10:00 AM – 4:00 PM' },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-gray-500">{row.day}</span>
                    <span className="text-gray-900 font-medium">{row.hours}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-green-700 bg-green-50 border border-green-100 rounded px-3 py-2">
                Available for consultation now
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex gap-6">
            {(['overview', 'services', 'reviews', 'contact'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors capitalize ${
                  activeTab === tab
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        <div className="mb-12">

          {activeTab === 'overview' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-5">Specialisations</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                {displayAgent.specialties.map((specialty, i) => (
                  <div key={i} className="border border-gray-200 rounded p-5">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{specialty}</h3>
                    <p className="text-xs text-gray-500">Expert consultation for {specialty.toLowerCase()}.</p>
                  </div>
                ))}
              </div>

              <h2 className="text-lg font-semibold text-gray-900 mb-5">Services</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service, i) => (
                  <div key={i} className="border border-gray-200 rounded p-5">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{service.title}</h3>
                    <p className="text-xs text-gray-500">{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-4">
              {displayAgent.specialties.map((specialty, i) => (
                <div key={i} className="border border-gray-200 rounded p-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">{specialty}</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">What's included</h4>
                      <ul className="space-y-1.5 text-sm text-gray-600">
                        {['Personalised vehicle selection', 'Comprehensive insurance options', '24/7 roadside assistance'].map((item, j) => (
                          <li key={j} className="flex items-center gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Pricing</h4>
                      <p className="text-lg font-bold text-gray-900">From $85/day</p>
                      <p className="text-xs text-gray-500 mt-1">Custom rates for long-term rentals</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Client Reviews</h2>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">{displayAgent.rating}</span>
                  <div>
                    <div className="flex">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={`w-4 h-4 ${s <= Math.floor(displayAgent.rating) ? 'text-orange-500 fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{displayAgent.reviews} reviews</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-medium text-gray-900">{review.name}</p>
                          {review.verified && <BadgeCheck className="w-3.5 h-3.5 text-green-500" />}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">
                            {[1,2,3,4,5].map((s) => (
                              <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-orange-500 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <span className="text-xs text-gray-400">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 border border-gray-200 rounded p-5 text-center">
                <p className="text-sm text-gray-700 font-medium mb-1">Share your experience</p>
                <p className="text-xs text-gray-500 mb-4">Help others by reviewing {displayAgent.name.split(' ')[0]}</p>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors">
                  Write a Review
                </button>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="max-w-xl">
              <div className="border border-gray-200 rounded p-7">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Contact {displayAgent.name.split(' ')[0]}</h2>
                <p className="text-sm text-gray-500 mb-6">Get in touch for personalised vehicle rental assistance.</p>
                <div className="space-y-4">
                  {[
                    { label: 'Your Name',     name: 'name',    type: 'text',  placeholder: 'Enter your full name' },
                    { label: 'Email Address', name: 'email',   type: 'email', placeholder: 'Enter your email' },
                    { label: 'Phone Number',  name: 'phone',   type: 'tel',   placeholder: 'Enter your phone number' },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className={labelClass}>{field.label}</label>
                      <input type={field.type} name={field.name} placeholder={field.placeholder} className={inputClass} />
                    </div>
                  ))}
                  <div>
                    <label className={labelClass}>Message</label>
                    <textarea rows={4} name="message" placeholder="Tell us about your vehicle needs..." className={`${inputClass} resize-none`} />
                  </div>
                  <button className="bg-orange-600 text-white py-2.5 px-6 rounded text-sm font-medium hover:bg-orange-700 transition-colors">
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related agents */}
        {relatedAgents.length > 0 && (
          <div className="mt-12 pt-10 border-t border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Other Agents</h2>
              <Link href="/agents" className="text-sm text-orange-600 hover:underline">View all →</Link>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedAgents.map((a) => (
                <Link key={a.id} href={`/agents/${a.id}`} className="group border border-gray-200 rounded p-5 hover:border-gray-300 transition-colors block">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100 shrink-0">
                      <Image src={a.image} alt={a.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">{a.name}</p>
                      <p className="text-xs text-gray-500">{a.role}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 text-orange-500 fill-current" />
                        <span className="text-xs font-medium text-gray-900">{a.rating}</span>
                        <span className="text-xs text-gray-400">({a.reviews})</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {a.specialties.slice(0, 2).map((s, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{s}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 mt-16">
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <div>
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} AutoRent Pro. All rights reserved.</p>
            <p className="text-xs text-gray-400 mt-0.5">Professional Vehicle Rental Services</p>
          </div>
          <div className="flex items-center gap-5">
            <a href="tel:+254743861565" className="text-sm text-gray-600 hover:text-gray-900">+254 743 861 565</a>
            <a href="mailto:support@autorentpro.com" className="text-sm text-gray-600 hover:text-gray-900">support@autorentpro.com</a>
          </div>
        </div>
      </footer>

      {/* Contact modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-gray-900">Contact {displayAgent.name.split(' ')[0]}</h3>
                <button onClick={() => setShowContactForm(false)} disabled={sending} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                {[
                  { label: 'Your Name *', name: 'name',  type: 'text',  placeholder: 'Enter your name' },
                  { label: 'Email *',     name: 'email', type: 'email', placeholder: 'Enter your email' },
                  { label: 'Phone *',     name: 'phone', type: 'tel',   placeholder: 'Enter your phone number' },
                ].map((field) => (
                  <div key={field.name}>
                    <label className={labelClass}>{field.label}</label>
                    <input type={field.type} name={field.name} required disabled={sending} placeholder={field.placeholder} className={inputClass} />
                  </div>
                ))}

                <div>
                  <label className={labelClass}>Rental Type</label>
                  <select name="rentalType" disabled={sending} className={inputClass}>
                    <option value="General">General Inquiry</option>
                    <option value="Daily">Daily Rental</option>
                    <option value="Weekly">Weekly Rental</option>
                    <option value="Monthly">Monthly Rental</option>
                    <option value="Safari">Safari Package</option>
                    <option value="Corporate">Corporate Fleet</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Message *</label>
                  <textarea name="message" rows={4} required disabled={sending} placeholder="Tell us about your vehicle needs..." className={`${inputClass} resize-none`} />
                </div>

                <button type="submit" disabled={sending}
                  className="w-full bg-orange-600 text-white py-2.5 rounded text-sm font-medium hover:bg-orange-700 disabled:bg-gray-200 disabled:text-gray-400 transition-colors flex items-center justify-center gap-2">
                  {sending ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending…</>
                  ) : 'Send Message'}
                </button>

                <p className="text-xs text-gray-400 text-center">Your message will be sent to {displayAgent.name}.</p>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SingleAgentPage;