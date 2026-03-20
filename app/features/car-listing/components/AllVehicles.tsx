"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { FaHeart, FaLock } from "react-icons/fa";
import { CarProps } from "../types";
import CarRentPopUp from "@/app/features/Rent/components/CarRentPopUp";

interface CarWithLocation extends CarProps {
  location?: string;
}

interface UserType {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
}

interface AllVehiclesProps {
  loggedUser?: UserType;
}

function VehiclesContent({ loggedUser }: AllVehiclesProps) {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [cars, setCars] = useState<CarWithLocation[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCar, setSelectedCar] = useState<CarWithLocation | null>(null);
  const [searchFilters, setSearchFilters] = useState({
    pickupDate: "", returnDate: "", location: "", category: "", search: "",
  });
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res  = await fetch("/features/auth/api/signin", { method: "GET", credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.authenticated && data.user ? data.user : null);
        } else {
          setCurrentUser(null);
        }
      } catch {
        setCurrentUser(null);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => { if (loggedUser) setCurrentUser(loggedUser); }, [loggedUser]);

  useEffect(() => {
    setSearchFilters({
      pickupDate: searchParams.get("pickupDate") || "",
      returnDate: searchParams.get("returnDate") || "",
      location:   searchParams.get("location")   || "",
      category:   searchParams.get("category")   || "",
      search:     searchParams.get("search")     || "",
    });
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat.toLowerCase());
  }, [searchParams]);

  const categories = [
    { id: "all",      name: "All" },
    { id: "economy",  name: "Economy" },
    { id: "suv",      name: "SUV" },
    { id: "luxury",   name: "Luxury" },
    { id: "sports",   name: "Sports" },
    { id: "compact",  name: "Compact" },
    { id: "midsize",  name: "Midsize" },
    { id: "fullsize", name: "Fullsize" },
  ];

  const fetchCars = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchFilters.category && searchFilters.category !== "all")
        params.append("category", searchFilters.category.toUpperCase());
      if (searchFilters.pickupDate && searchFilters.returnDate)
        params.append("availableOnly", "true");
      if (searchFilters.search)     params.append("search", searchFilters.search);
      else if (searchFilters.location) params.append("search", searchFilters.location);

      const qs  = params.toString();
      const res = await fetch(qs ? `/features/car-listing/api/cars?${qs}` : "/features/car-listing/api/cars");
      if (!res.ok) { setCars([]); return; }

      const data = await res.json();
      if (!data.data || !Array.isArray(data.data)) { setCars([]); return; }

      setCars(data.data.map((car: any) => ({
        id:       car.id,
        name:     `${car.make} ${car.model}`,
        img:      car.image || "/default-car.jpg",
        fuelType: car.fuelType,
        seats:    car.seats,
        gear:     car.transmission,
        drive:    car.drive,
        price:    car.price,
        power:    car.power || null,
        year:     car.year,
        featured: car.rating ? car.rating > 4.5 : false,
        category: car.category ? car.category.toLowerCase() : "unknown",
        location: car.location || "",
      })));
    } catch {
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCars(); }, [searchFilters]);

  const filteredCars = selectedCategory === "all"
    ? cars
    : cars.filter((c) => c.category === selectedCategory);

  const updatedCategories = categories.map((cat) => ({
    ...cat,
    count: cat.id === "all" ? cars.length : cars.filter((c) => c.category === cat.id).length,
  }));

  const uniqueLocations = [...new Set(cars.map((c) => c.location).filter(Boolean))];

  const toggleFavorite = (id: number) =>
    setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);

  const handleRentNow = (car: CarWithLocation) => {
    if (!currentUser) { setShowLoginModal(true); return; }
    setSelectedCar(car);
    setShowPopup(true);
  };

  const clearAllFilters = () => {
    setSelectedCategory("all");
    window.history.replaceState({}, "", "/vehicles");
    setSearchFilters({ pickupDate: "", returnDate: "", location: "", category: "", search: "" });
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const params = new URLSearchParams(window.location.search);
    if (categoryId === "all") params.delete("category");
    else params.set("category", categoryId.toUpperCase());
    window.history.replaceState({}, "", `/vehicles${params.toString() ? "?" + params.toString() : ""}`);
  };

  const hasActiveFilters = () =>
    !!(searchFilters.pickupDate || searchFilters.returnDate ||
       searchFilters.location   || searchFilters.category   || searchFilters.search);

  return (
    <div className="w-full px-4 sm:px-6 py-10 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-0.5">Available Cars</h1>
          <p className="text-sm text-gray-500">
            {loading ? "Loading…" : `${filteredCars.length} car${filteredCars.length !== 1 ? "s" : ""} available`}
            {searchFilters.location ? ` near ${searchFilters.location}` : ""}
          </p>
        </div>

        {/* Active filters */}
        {hasActiveFilters() && (
          <div className="flex flex-wrap items-center gap-2 mb-5 text-xs">
            <span className="text-gray-400">Active filters:</span>
            {searchFilters.pickupDate && (
              <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded">
                Pickup: {new Date(searchFilters.pickupDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </span>
            )}
            {searchFilters.returnDate && (
              <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded">
                Return: {new Date(searchFilters.returnDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </span>
            )}
            {searchFilters.location && (
              <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded">{searchFilters.location}</span>
            )}
            {searchFilters.search && (
              <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded">"{searchFilters.search}"</span>
            )}
            <button onClick={clearAllFilters} className="text-orange-600 hover:underline ml-1">Clear all</button>
          </div>
        )}

        {/* Category tabs */}
        <div className="flex gap-2 mb-7 overflow-x-auto pb-1">
          {updatedCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded text-sm border transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? "bg-orange-600 border-orange-600 text-white"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {cat.name}
              <span className={`ml-1.5 text-xs ${selectedCategory === cat.id ? "text-orange-200" : "text-gray-400"}`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="border border-gray-100 rounded overflow-hidden animate-pulse">
                <div className="h-32 sm:h-44 bg-gray-100" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-8 bg-gray-100 rounded mt-3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        {!loading && (
          <>
            {filteredCars.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-gray-700 font-medium mb-1">No cars found</p>
                <p className="text-gray-400 text-sm mb-4">
                  {cars.length === 0 ? "Could not load vehicles. Please try again." : "Try changing your filters."}
                </p>
                <button onClick={clearAllFilters} className="text-sm text-orange-600 hover:underline">
                  {cars.length === 0 ? "Retry" : "Clear filters"}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5 mb-10">
                {filteredCars.map((car) => (
                  <div key={car.id} className="bg-white border border-gray-200 rounded overflow-hidden flex flex-col">

                    {/* Image */}
                    <div className="relative h-32 sm:h-44 w-full bg-gray-100 shrink-0">
                      <Image
                        src={car.img || "/default-car.jpg"}
                        alt={car.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                      {car.featured && (
                        <span className="absolute top-2 left-2 bg-orange-600 text-white text-[9px] font-medium px-2 py-0.5 rounded">
                          Top pick
                        </span>
                      )}
                      <button
                        onClick={() => toggleFavorite(car.id)}
                        className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                          favorites.includes(car.id) ? "bg-red-500 text-white" : "bg-white text-gray-400 hover:text-red-400"
                        }`}
                      >
                        <FaHeart size={10} />
                      </button>
                    </div>

                    {/* Body */}
                    <div className="p-3 sm:p-4 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-1 mb-2">
                        <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">{car.name}</h3>
                        <span className="text-[10px] text-gray-400 shrink-0 mt-0.5 hidden sm:block">{car.year}</span>
                      </div>

                      {/* Specs — plain text, no icons */}
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-3 text-xs text-gray-500">
                        <span>{car.fuelType || "—"}</span>
                        <span>{car.gear || "—"}</span>
                        <span>{car.seats} seats</span>
                        <span>{car.drive || "—"}</span>
                      </div>

                      {car.location && (
                        <p className="hidden sm:block text-xs text-gray-400 mb-3 truncate">{car.location}</p>
                      )}

                      {/* Price + CTA */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 mt-auto gap-2">
                        <div>
                          <p className="text-sm sm:text-base font-bold text-gray-900">Ksh {car.price?.toLocaleString()}</p>
                          <p className="text-[10px] text-gray-400">per day</p>
                        </div>
                        <button
                          onClick={() => handleRentNow(car)}
                          className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded transition-colors shrink-0"
                        >
                          Rent now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer count */}
            {cars.length > 0 && (
              <div className="flex gap-6 pt-5 border-t border-gray-100 text-sm text-gray-500">
                <span><strong className="text-gray-800">{cars.length}</strong> cars listed</span>
                <span><strong className="text-gray-800">{uniqueLocations.length}</strong> location{uniqueLocations.length !== 1 ? "s" : ""}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Login modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded p-6 max-w-sm w-full border border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 mb-1">Sign in to continue</h3>
            <p className="text-gray-500 text-sm mb-5">You need an account to rent a vehicle.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLoginModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => (window.location.href = "/auth/signin")}
                className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded transition-colors"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      )}

      <CarRentPopUp
        showPopup={showPopup}
        selectedCar={selectedCar}
        closePopup={() => { setShowPopup(false); setSelectedCar(null); }}
        user={currentUser ? {
          id:   currentUser.id,
          name: `${currentUser.firstName} ${currentUser.lastName}`.trim(),
        } : undefined}
      />
    </div>
  );
}

const AllVehicles: React.FC<AllVehiclesProps> = ({ loggedUser }) => (
  <Suspense fallback={
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 p-4 sm:p-6">
      {[1,2,3,4,5,6].map((i) => (
        <div key={i} className="bg-gray-100 rounded h-52 sm:h-64 animate-pulse" />
      ))}
    </div>
  }>
    <VehiclesContent loggedUser={loggedUser} />
  </Suspense>
);

export default AllVehicles;