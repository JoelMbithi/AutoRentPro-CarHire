"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Search, ChevronRight } from "lucide-react";
import { AgentsProps } from "../types";
import { useRouter } from "next/navigation";

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
      const agentsData: AgentsProps[] = Array.isArray(data)
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
        a.name.toLowerCase().includes(t) ||
        a.role.toLowerCase().includes(t) ||
        a.bio.toLowerCase().includes(t)
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
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-xs">
        <p className="text-gray-900 font-semibold mb-1">Could not load agents</p>
        <p className="text-gray-400 text-sm mb-6">{error}</p>
        <button onClick={fetchAgents} className="text-sm text-orange-500 hover:text-orange-600 underline mr-4">
          Try again
        </button>
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">Go home</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section
        className="relative text-white bg-cover bg-center"
        style={{ backgroundImage: "url('/Agents.png')" }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-58">

          <div className="flex items-center gap-2 mb-4 sm:mb-5">
            <span className="h-px w-8 bg-orange-500" />
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-500">
              Kenya's most trusted car rental team
            </p>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 leading-tight">
            Meet our <span className="text-orange-500">expert agents</span>
          </h1>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl mb-8 sm:mb-10">
            Professional car rental specialists dedicated to making your journey seamless across Kenya.
          </p>

         
        </div>
      </section>

      {/* ── Filters ── */}
      {agents.length > 0 && (
        <section className="bg-white border-b border-gray-100 sticky top-0 z-30">
          <div className="max-w-5xl mx-auto px-6 sm:px-10 py-4">
            <div className="flex flex-wrap gap-3 items-center">

              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name or role…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded text-sm bg-white focus:outline-none focus:border-gray-400 transition-colors"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Location */}
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="py-2 px-3 border border-gray-200 rounded text-sm bg-white focus:outline-none focus:border-gray-400 transition-colors"
              >
                {allLocations.map((l) => <option key={l}>{l}</option>)}
              </select>

              {/* Clear */}
              {(selectedSpecialties.length > 0 || selectedLocation !== "All") && (
                <button onClick={resetFilters} className="text-sm text-gray-400 hover:text-gray-700 underline transition-colors">
                  Clear
                </button>
              )}
            </div>

            {/* Specialty chips */}
            {allSpecialties.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {allSpecialties.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSpecialty(s)}
                    className={`px-3 py-1 rounded-full text-xs transition-colors ${
                      selectedSpecialties.includes(s)
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Grid ── */}
      <section className="py-14 px-6 sm:px-10">
        <div className="max-w-5xl mx-auto">

          <div className="flex items-baseline justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">The team</h2>
              <p className="text-sm text-gray-400 mt-1">
                {filteredAgents.length} agent{filteredAgents.length !== 1 ? "s" : ""}
                {selectedLocation !== "All" && ` in ${selectedLocation}`}
              </p>
            </div>
            {agents.length > 0 && (
              <Link
                href="/agents/schedule"
                className="hidden sm:inline-flex text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
              >
                Schedule a call →
              </Link>
            )}
          </div>

          {/* Empty states */}
          {filteredAgents.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-900 font-semibold mb-1">
                {agents.length === 0 ? "No agents available" : "No results"}
              </p>
              <p className="text-sm text-gray-400 mb-6">
                {agents.length === 0 ? "Check back soon." : "Try a different search or filter."}
              </p>
              <button
                onClick={agents.length === 0 ? fetchAgents : resetFilters}
                className="text-sm text-orange-500 hover:text-orange-600 underline"
              >
                {agents.length === 0 ? "Retry" : "Clear filters"}
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAgents.map((agent) => (
                  <div
                    key={agent.id}
                    onClick={() => handleAgentClick(agent.id)}
                    className="group cursor-pointer "
                  >
                    {/* Photo */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 rounded mb-4">
                      <Image
                        src={agent.image}
                        alt={agent.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority={agent.id <= 3}
                      />
                      {/* Rating pill */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium text-gray-900">
                        ★ {agent.rating}
                        <span className="text-gray-400 font-normal">({agent.reviews})</span>
                      </div>
                      {/* Hover actions */}
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={(e) => handleShare(agent, e)}
                          className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:bg-white transition-colors text-xs"
                        >
                          ↗
                        </button>
                        <button
                          onClick={(e) => handleContactClick(agent, e)}
                          className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors text-xs"
                        >
                          ✉
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <p className="font-semibold text-gray-900 group-hover:text-orange-500 transition-colors text-sm mb-0.5 leading-tight">
                      {agent.name}
                    </p>
                    <p className="text-xs text-orange-500 mb-1.5">{agent.role}</p>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-3">{agent.bio}</p>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {agent.specialties.slice(0, 3).map((s, i) => (
                        <span key={i} className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded-sm">{s}</span>
                      ))}
                      {agent.specialties.length > 3 && (
                        <span className="text-xs text-gray-400">+{agent.specialties.length - 3}</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => handleContactClick(agent, e)}
                        className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded transition-colors"
                      >
                        Contact
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAgentClick(agent.id); }}
                        className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-500 rounded transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link href="/agents/all" className="text-sm text-gray-400 hover:text-gray-700 underline transition-colors">
                  View all {agents.length} agents
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-gray-100 py-16 px-6 sm:px-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Not sure where to start?</h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Call or email us and one of our agents will help you find the right vehicle for your trip.
            </p>
          </div>
          <div className="space-y-3">
            <a
              href="tel:+254743861565"
              className="flex items-center justify-between w-full px-5 py-3.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded transition-colors"
            >
              <span>Call us</span>
              <span className="text-gray-400 text-xs font-normal">+254 743 861 565</span>
            </a>
            <a
              href="mailto:support@autorentpro.com"
              className="flex items-center justify-between w-full px-5 py-3.5 border border-gray-200 hover:border-gray-300 text-gray-900 text-sm font-medium rounded transition-colors"
            >
              <span>Email us</span>
              <span className="text-gray-400 text-xs font-normal">support@autorentpro.com</span>
            </a>
            <Link
              href="/contact"
              className="block text-center text-xs text-gray-400 hover:text-gray-600 pt-1 transition-colors"
            >
              Or send a message via the contact form →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default OurAgents;