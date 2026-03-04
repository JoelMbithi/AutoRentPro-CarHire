"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone, Mail, Star, MapPin, Award, Clock, Users,
  BadgeCheck, Calendar, Car, MessageSquare, Share2,
  ChevronRight, Filter, Search, X, Loader2,
} from "lucide-react";
import { AgentsProps } from "../types";
import { useRouter } from "next/navigation";

const stats = [
  { number: "5,000+", label: "Happy Customers", icon: Users },
  { number: "98%",    label: "Satisfaction Rate", icon: Star },
  { number: "24/7",   label: "Support Available", icon: Clock },
  { number: "15min",  label: "Avg. Response Time", icon: Award },
];

const OurAgents = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState<AgentsProps[]>([]);
  const [filteredAgents, setFilteredAgents] = useState<AgentsProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("All");

  const fetchAgents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/features/Car-Agents/api/agents", {
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
      const data = await response.json();
      let agentsData: AgentsProps[] = Array.isArray(data)
        ? data
        : Array.isArray(data.agents)
        ? data.agents
        : Array.isArray(data.data)
        ? data.data
        : [];
      if (agentsData.length === 0) throw new Error("No agents available");
      setAgents(agentsData);
      setFilteredAgents(agentsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load agents.");
      setAgents([]);
      setFilteredAgents([]);
    } finally {
      setLoading(false);
    }
  };

  const allSpecialties = Array.from(new Set(agents.flatMap((a) => a.specialties || [])));
  const allLocations = ["All", ...Array.from(new Set(agents.map((a) => a.location?.split(",")[0] || "Unknown").filter(Boolean)))];

  useEffect(() => {
    if (!agents.length) { setFilteredAgents([]); return; }
    let result = agents;
    if (searchTerm.trim()) {
      const t = searchTerm.toLowerCase();
      result = result.filter((a) =>
        a.name.toLowerCase().includes(t) || a.role.toLowerCase().includes(t) || a.bio.toLowerCase().includes(t)
      );
    }
    if (selectedSpecialties.length)
      result = result.filter((a) => selectedSpecialties.some((s) => a.specialties.includes(s)));
    if (selectedLocation !== "All")
      result = result.filter((a) => a.location.startsWith(selectedLocation));
    setFilteredAgents(result);
  }, [agents, searchTerm, selectedSpecialties, selectedLocation]);

  useEffect(() => { fetchAgents(); }, []);

  const handleAgentClick = (id: number) => router.push(`/features/Car-Agents/components/agents/${id}`);
  const handleContactClick = (agent: AgentsProps, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/contact?agent=${agent.id}&name=${encodeURIComponent(agent.name)}`);
  };
  const handleShare = (agent: AgentsProps, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/features/Car-Agents/api/agents/${agent.id}`;
    navigator.share
      ? navigator.share({ title: `${agent.name} – AutoRentPro`, url })
      : navigator.clipboard.writeText(url);
  };
  const toggleSpecialty = (s: string) =>
    setSelectedSpecialties((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  const resetFilters = () => { setSearchTerm(""); setSelectedSpecialties([]); setSelectedLocation("All"); };

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-gray-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500 tracking-wide">Loading agents…</p>
      </div>
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-sm">
        <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <X className="w-5 h-5 text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Unable to load agents</h3>
        <p className="text-gray-500 text-sm mb-6">{error}</p>
        <button
          onClick={fetchAgents}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors mb-3"
        >
          Try again
        </button>
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 font-medium">← Return home</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <section
        className="relative text-white py-58 bg-cover bg-center"
        style={{ backgroundImage: "url('/Agents.png')" }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 max-w-5xl mx-auto px-6">

          <div className="flex items-center gap-2 mb-5">
            <span className="h-px w-8 bg-orange-500" />
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-400">
              Kenya's most trusted car rental team
            </p>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-4">
            Meet our <span className="text-orange-400">expert agents</span>
          </h1>
          <p className="text-gray-300 text-base leading-relaxed max-w-xl mb-10">
            Professional car rental specialists dedicated to making your journey seamless across Kenya.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-xl pb-2">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label}>
                  <p className="text-2xl font-black text-orange-400">{s.number}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Filters ── */}
      {agents.length > 0 && (
        <section className="bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex flex-col lg:flex-row gap-3 items-center">

              {/* Search */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name, role, or expertise…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Location + clear */}
              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                >
                  {allLocations.map((l) => <option key={l}>{l}</option>)}
                </select>

                {(selectedSpecialties.length > 0 || selectedLocation !== "All") && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-gray-300 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Clear
                  </button>
                )}
              </div>
            </div>

            {/* Specialty chips */}
            {allSpecialties.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {allSpecialties.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSpecialty(s)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      selectedSpecialties.includes(s)
                        ? "bg-orange-600 border-orange-600 text-white"
                        : "bg-white border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600"
                    }`}
                  >
                    {s}
                    {selectedSpecialties.includes(s) && <X className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Grid ── */}
      <section className="py-14 px-6">
        <div className="max-w-5xl mx-auto">

          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Our team</h2>
              <p className="text-sm text-gray-400 mt-1">
                {filteredAgents.length} agent{filteredAgents.length !== 1 ? "s" : ""}
                {selectedLocation !== "All" && ` in ${selectedLocation}`}
              </p>
            </div>
            {agents.length > 0 && (
              <Link
                href="/agents/schedule"
                className="hidden lg:inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm shadow-orange-200"
              >
                <Calendar className="w-4 h-4" />
                Schedule consultation
              </Link>
            )}
          </div>

          {/* Empty states */}
          {filteredAgents.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {agents.length === 0 ? <Users className="w-5 h-5 text-gray-400" /> : <Search className="w-5 h-5 text-gray-400" />}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {agents.length === 0 ? "No agents available" : "No agents found"}
              </h3>
              <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
                {agents.length === 0
                  ? "There are currently no agents available. Please check back later."
                  : "Try adjusting your search or filters."}
              </p>
              <button
                onClick={agents.length === 0 ? fetchAgents : resetFilters}
                className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
              >
                {agents.length === 0 ? "Retry" : "Clear filters"}
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgents.map((agent) => (
                  <div
                    key={agent.id}
                    onClick={() => handleAgentClick(agent.id)}
                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-orange-100 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
                  >
                    {/* Image */}
                    <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                      <Image
                        src={agent.image}
                        alt={agent.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority={agent.id <= 3}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                      {/* Verified */}
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
                        <BadgeCheck className="w-3 h-3" /> Verified
                      </div>

                      {/* Rating */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                        <span className="font-bold text-gray-900">{agent.rating}</span>
                        <span className="text-gray-400 text-xs">({agent.reviews})</span>
                      </div>

                      {/* Hover actions */}
                      <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={(e) => handleShare(agent, e)}
                          className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <Share2 className="w-3.5 h-3.5 text-gray-700" />
                        </button>
                        <button
                          onClick={(e) => handleContactClick(agent, e)}
                          className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center hover:bg-orange-700 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h2 className="text-base font-bold text-gray-900 group-hover:text-orange-600 transition-colors leading-tight">
                          {agent.name}
                        </h2>
                        <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full shrink-0 mt-0.5">
                          {agent.joined}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-2">{agent.role}</p>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">{agent.bio}</p>

                      {/* Specialties */}
                      <div className="mb-4">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Specialties</p>
                        <div className="flex flex-wrap gap-1.5">
                          {agent.specialties.slice(0, 3).map((s, i) => (
                            <span key={i} className="text-[11px] bg-orange-50 text-orange-600 font-medium px-2.5 py-0.5 rounded-full">
                              {s}
                            </span>
                          ))}
                          {agent.specialties.length > 3 && (
                            <span className="text-[11px] bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded-full">
                              +{agent.specialties.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Mini stats */}
                      <div className="grid grid-cols-3 gap-3 py-3 border-t border-gray-100 mb-4">
                        <div className="text-center">
                          <p className="text-sm font-bold text-gray-900">{agent.reviews}+</p>
                          <p className="text-[10px] text-gray-400">Bookings</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-gray-900">{agent.responseTime.split(" ")[0]}</p>
                          <p className="text-[10px] text-gray-400">Response</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-gray-900">{agent.languages.length}</p>
                          <p className="text-[10px] text-gray-400">Languages</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-auto">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleContactClick(agent, e); }}
                          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-orange-200"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Contact agent
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAgentClick(agent.id); }}
                          className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl flex items-center justify-center transition-colors shrink-0"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-10">
                <Link href="/agents/all" className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors">
                  View all {agents.length} agents <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-6 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="h-px w-8 bg-orange-500" />
              <p className="text-xs font-semibold uppercase tracking-widest text-orange-400">Expert assistance</p>
            </div>
            <h2 className="text-3xl font-black tracking-tight mb-4 leading-tight">
              Need personalized<br />rental advice?
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
              Let our team match you with the perfect vehicle and create a plan tailored to your journey.
            </p>
            <div className="space-y-4">
              {[
                { icon: <Car className="w-4 h-4" />,   title: "Wide vehicle selection",  sub: "Economy to luxury SUVs" },
                { icon: <Clock className="w-4 h-4" />,  title: "24/7 Support",            sub: "Round-the-clock assistance" },
                { icon: <Award className="w-4 h-4" />,  title: "Best price guarantee",    sub: "No hidden fees" },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-orange-400 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-7">
            <h3 className="text-lg font-bold mb-5">Get expert advice</h3>
            <div className="flex flex-col gap-3 mb-6">
              <button
                onClick={() => (window.location.href = "tel:+254743861565")}
                className="flex items-center justify-between bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-5 rounded-xl text-sm transition-colors"
              >
                <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> Call our team</span>
                <span className="text-orange-200 text-xs font-normal">+254 743 861 565</span>
              </button>
              <button
                onClick={() => (window.location.href = "mailto:support@autorentpro.com")}
                className="flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold py-3 px-5 rounded-xl text-sm transition-colors"
              >
                <Mail className="w-4 h-4" /> Email experts
              </button>
            </div>
            <div className="pt-5 border-t border-white/10">
              <p className="text-xs text-gray-400 flex items-center gap-2 mb-3">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                Average response time: <span className="text-white font-semibold">under 15 minutes</span>
              </p>
              <Link
                href="/contact"
                className="block text-center text-sm text-gray-400 hover:text-white transition-colors"
              >
                Or send us a message →
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default OurAgents;