"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  FaGasPump, FaUserFriends, FaCog, FaHeart,
  FaMapMarkerAlt, FaLock,
} from "react-icons/fa";
import { IoSpeedometer } from "react-icons/io5";
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

// Inner component that uses useSearchParams
function VehiclesContent({ loggedUser }: AllVehiclesProps) {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [cars, setCars] = useState<CarWithLocation[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCar, setSelectedCar] = useState<CarWithLocation | null>(null);
  const [searchFilters, setSearchFilters] = useState({
    pickupDate: "",
    returnDate: "",
    location: "",
    category: "",
    search: "",
  });
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const checkAuth = async () => {
    try {
      const response = await fetch("/features/auth/api/signin", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.authenticated && data.user ? data.user : null);
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => { checkAuth(); }, []);

  useEffect(() => {
    if (loggedUser) setCurrentUser(loggedUser);
  }, [loggedUser]);

  useEffect(() => {
    const pickupDate = searchParams.get("pickupDate") || "";
    const returnDate = searchParams.get("returnDate") || "";
    const location = searchParams.get("location") || "";
    const category = searchParams.get("category") || "";
    const search = searchParams.get("search") || "";
    setSearchFilters({ pickupDate, returnDate, location, category, search });
    if (category) setSelectedCategory(category.toLowerCase());
  }, [searchParams]);

  const categories = [
    { id: "all", name: "All" },
    { id: "economy", name: "Economy" },
    { id: "suv", name: "SUV" },
    { id: "luxury", name: "Luxury" },
    { id: "sports", name: "Sports" },
    { id: "compact", name: "Compact" },
    { id: "midsize", name: "Midsize" },
    { id: "fullsize", name: "Fullsize" },
  ];

  const fetchCars = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (searchFilters.category && searchFilters.category !== "all") {
        params.append("category", searchFilters.category.toUpperCase());
      }
      if (searchFilters.pickupDate && searchFilters.returnDate) {
        params.append("availableOnly", "true");
      }
      if (searchFilters.search) {
        params.append("search", searchFilters.search);
      } else if (searchFilters.location) {
        params.append("search", searchFilters.location);
      }

      const qs = params.toString();
      const url = qs
        ? `/features/car-listing/api/cars?${qs}`
        : "/features/car-listing/api/cars";

      const response = await fetch(url);
      if (!response.ok) { setCars([]); return; }

      const data = await response.json();
      if (!data.data || !Array.isArray(data.data)) { setCars([]); return; }

      setCars(data.data.map((car: any) => ({
        id: car.id,
        name: `${car.make} ${car.model}`,
        img: car.image || "/default-car.jpg",
        fuelType: car.fuelType,
        seats: car.seats,
        gear: car.transmission,
        drive: car.drive,
        price: car.price,
        power: car.power || null,
        year: car.year,
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

  const filteredCars =
    selectedCategory === "all"
      ? cars
      : cars.filter((car) => car.category === selectedCategory);

  const updatedCategories = categories.map((cat) => ({
    ...cat,
    count:
      cat.id === "all"
        ? cars.length
        : cars.filter((car) => car.category === cat.id).length,
  }));

  const uniqueLocations = [...new Set(cars.map((c) => c.location).filter(Boolean))];

  const toggleFavorite = (id: number) =>
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );

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
    if (categoryId === "all") {
      params.delete("category");
    } else {
      params.set("category", categoryId.toUpperCase());
    }
    window.history.replaceState({}, "", `/vehicles${params.toString() ? "?" + params.toString() : ""}`);
  };

  const hasActiveFilters = () =>
    !!(searchFilters.pickupDate || searchFilters.returnDate || searchFilters.location || searchFilters.category || searchFilters.search);

  return (
    <div className="w-full px-6 py-12 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Available Cars</h1>
          <p className="text-gray-500 text-sm">
            {loading
              ? "Loading…"
              : `${filteredCars.length} car${filteredCars.length !== 1 ? "s" : ""} available`}
            {searchFilters.location ? ` near ${searchFilters.location}` : ""}
          </p>
        </div>

        {/* Active filters */}
        {hasActiveFilters() && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-xs text-gray-400">Filters:</span>
            {searchFilters.pickupDate && (
              <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                Pickup: {new Date(searchFilters.pickupDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </span>
            )}
            {searchFilters.returnDate && (
              <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                Return: {new Date(searchFilters.returnDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </span>
            )}
            {searchFilters.location && (
              <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                {searchFilters.location}
              </span>
            )}
            {searchFilters.search && (
              <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                "{searchFilters.search}"
              </span>
            )}
            <button onClick={clearAllFilters} className="text-xs text-orange-600 hover:underline ml-1">
              Clear all
            </button>
          </div>
        )}

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {updatedCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                selectedCategory === cat.id
                  ? "bg-orange-600 border-orange-600 text-white"
                  : "border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
            >
              {cat.name}
              <span className={`ml-1.5 text-xs ${selectedCategory === cat.id ? "text-orange-200" : "text-gray-400"}`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center text-sm text-gray-400">Loading vehicles…</div>
        )}

        {/* Grid */}
        {!loading && (
          <>
            {filteredCars.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-gray-700 font-medium mb-1">No cars found</p>
                <p className="text-gray-400 text-sm mb-4">
                  {cars.length === 0
                    ? "Could not load vehicles. Please try again."
                    : "Try changing your filters."}
                </p>
                <button onClick={clearAllFilters} className="text-sm text-orange-600 hover:underline">
                  {cars.length === 0 ? "Retry" : "Clear filters"}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-12">
                {filteredCars.map((car) => (
                  <div
                    key={car.id}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col hover:border-gray-300 transition-colors"
                  >
                    {/* Image */}
                    <div className="relative h-44 w-full bg-gray-100">
                      <Image
                        src={car.img || "/default-car.jpg"}
                        alt={car.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                        {car.featured && (
                          <span className="bg-orange-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                            Top pick
                          </span>
                        )}
                        <span className="bg-black/50 text-white text-[10px] px-2 py-0.5 rounded">
                          {car.year}
                        </span>
                      </div>
                      <button
                        onClick={() => toggleFavorite(car.id)}
                        className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center ${
                          favorites.includes(car.id)
                            ? "bg-red-500 text-white"
                            : "bg-white text-gray-400 hover:text-red-400"
                        }`}
                      >
                        <FaHeart className="text-xs" />
                      </button>
                    </div>

                    {/* Body */}
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="text-base font-semibold text-gray-900">{car.name}</h3>
                        {car.power && (
                          <span className="text-xs text-gray-400 shrink-0 mt-0.5">{car.power}</span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <FaGasPump className="text-gray-400" />
                          {car.fuelType?.toLowerCase() || "—"}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <IoSpeedometer className="text-gray-400" />
                          {car.gear?.toLowerCase() || "—"}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FaUserFriends className="text-gray-400" />
                          {car.seats} seats
                        </span>
                        <span className="flex items-center gap-1.5">
                          <FaCog className="text-gray-400" />
                          {car.drive || "—"}
                        </span>
                      </div>

                      {car.location && (
                        <p className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                          <FaMapMarkerAlt className="shrink-0" />
                          {car.location}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                        <div>
                          <span className="text-lg font-bold text-gray-900">
                            Ksh {car.price?.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-400 ml-1">/ day</span>
                        </div>
                        <button
                          onClick={() => handleRentNow(car)}
                          className="bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                        >
                          Rent
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer stats */}
            {cars.length > 0 && (
              <div className="flex gap-8 pt-6 border-t border-gray-100 text-sm text-gray-500">
                <span><strong className="text-gray-800">{cars.length}</strong> cars listed</span>
                <span><strong className="text-gray-800">{uniqueLocations.length}</strong> pickup location{uniqueLocations.length !== 1 ? "s" : ""}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-3">
              <FaLock className="text-gray-400" />
              <h3 className="text-base font-semibold text-gray-900">Sign in to continue</h3>
            </div>
            <p className="text-gray-500 text-sm mb-5">You need an account to rent a vehicle.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLoginModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => (window.location.href = "/auth/signin")}
                className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded-lg transition-colors"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rent Popup */}
      <CarRentPopUp
        showPopup={showPopup}
        selectedCar={selectedCar}
        closePopup={() => { setShowPopup(false); setSelectedCar(null); }}
        user={currentUser ? { 
          id: currentUser.id, 
          name: `${currentUser.firstName} ${currentUser.lastName}`.trim() 
        } : undefined}
      />
    </div>
  );
}

// Main exported component with Suspense
const AllVehicles: React.FC<AllVehiclesProps> = ({ loggedUser }) => {
  return (
    <Suspense fallback={
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse" />
        ))}
      </div>
    }>
      <VehiclesContent loggedUser={loggedUser} />
    </Suspense>
  );
};

export default AllVehicles;