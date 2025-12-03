"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { FaGasPump, FaUserFriends, FaCog, FaStar, FaHeart, FaTimes, FaCalendarAlt, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { IoSpeedometer, IoFlash } from "react-icons/io5";
import { CarProps } from "../types";
import CarRentPopUp from "@/app/features/Rent/components/CarRentPopUp";

// Create extended type with location
interface CarWithLocation extends CarProps {
  location?: string;
}

const AllVehicles = () => {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [cars, setCars] = useState<CarWithLocation[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCar, setSelectedCar] = useState<CarWithLocation | null>(null);
  const [searchFilters, setSearchFilters] = useState({
    pickupDate: '',
    returnDate: '',
    location: '',
    category: '',
    search: '',
  });
  
  // Get search parameters from URL
  useEffect(() => {
    const pickupDate = searchParams.get('pickupDate') || '';
    const returnDate = searchParams.get('returnDate') || '';
    const location = searchParams.get('location') || '';
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    
    console.log("📋 URL Search Params:", { pickupDate, returnDate, location, category, search });
    
    setSearchFilters({
      pickupDate,
      returnDate,
      location,
      category,
      search
    });
    
    // If category is provided in URL, set it as selected
    if (category) {
      setSelectedCategory(category.toLowerCase());
    }
  }, [searchParams]);

  const categories = [
    { id: "all", name: "All Cars", count: 12 },
    { id: "economy", name: "Economy", count: 3 },
    { id: "suv", name: "SUV", count: 4 },
    { id: "luxury", name: "Luxury", count: 3 },
    { id: "sports", name: "Sports", count: 2 },
    { id: "compact", name: "Compact", count: 2 },
    { id: "midsize", name: "Midsize", count: 2 },
    { id: "fullsize", name: "Fullsize", count: 1 },
  ];

  const fetchCars = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching cars with filters:", searchFilters);
      
      // Build query parameters
      const params = new URLSearchParams();
      
      // Add search filters if they exist
      if (searchFilters.category && searchFilters.category !== 'all') {
        params.append('category', searchFilters.category.toUpperCase());
      }
      
      // If pickupDate and returnDate exist, filter by availability
      if (searchFilters.pickupDate && searchFilters.returnDate) {
        params.append('availableOnly', 'true');
      }
      
      // Priority: Use search param first, then location
      if (searchFilters.search) {
        params.append('search', searchFilters.search);
      } else if (searchFilters.location) {
        params.append('search', searchFilters.location);
      }
      
      const queryString = params.toString();
      const url = queryString 
        ? `/features/car-listing/api/cars?${queryString}`
        : `/features/car-listing/api/cars`;
      
      console.log('🌐 Fetching from URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`❌ HTTP error! status: ${response.status}`);
        // Try fallback - fetch all cars without filters
        console.log('🔄 Trying fallback - fetching all cars...');
        const fallbackResponse = await fetch('/features/car-listing/api/cars');
        if (!fallbackResponse.ok) {
          throw new Error(`Fallback failed! status: ${fallbackResponse.status}`);
        }
        const data = await fallbackResponse.json();
        
        const mappedCars: CarWithLocation[] = data.data.map((car: any) => ({
          id: car.id,
          name: `${car.make} ${car.model}`,
          img: car.image,
          fuelType: car.fuelType,
          seats: car.seats,
          gear: car.transmission,
          drive: car.drive,
          price: car.price,
          power: car.power,
          year: car.year,
          featured: car.rating > 4.5,
          category: car.category.toLowerCase(),
          location: car.location || ''
        }));

        console.log(`🔄 Fallback fetched ${mappedCars.length} cars`);
        setCars(mappedCars);
        return;
      }
      
      const data = await response.json();
      console.log('✅ API Response:', {
        success: data.success,
        count: data.count,
        dataLength: data.data?.length || 0
      });

      // Check if data.data exists
      if (!data.data || !Array.isArray(data.data)) {
        console.error('❌ Invalid API response format:', data);
        setCars([]);
        return;
      }

      const mappedCars: CarWithLocation[] = data.data.map((car: any) => ({
        id: car.id,
        name: `${car.make} ${car.model}`,
        img: car.image,
        fuelType: car.fuelType,
        seats: car.seats,
        gear: car.transmission,
        drive: car.drive,
        price: car.price,
        power: car.power,
        year: car.year,
        featured: car.rating > 4.5,
        category: car.category.toLowerCase(),
        location: car.location || ''
      }));

      console.log(`✅ Mapped ${mappedCars.length} cars`);
      setCars(mappedCars);

    } catch (error: any) {
      console.error('❌ Error fetching cars:', error);
      // Set empty array to show "no cars" state
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [searchFilters]);

  const filteredCars = selectedCategory === "all" 
    ? cars 
    : cars.filter(car => car.category === selectedCategory);

  // Update category counts based on actual data
  const updatedCategories = categories.map(cat => ({
    ...cat,
    count: cat.id === "all" ? cars.length : cars.filter(car => car.category === cat.id).length
  }));

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  const handleRentNow = (car: CarWithLocation) => {
    setSelectedCar(car);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedCar(null);
  };

  const clearAllFilters = () => {
    setSelectedCategory('all');
    window.history.replaceState({}, '', '/vehicles');
    setSearchFilters({
      pickupDate: '',
      returnDate: '',
      location: '',
      category: '',
      search: ''
    });
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    // Update URL with category filter
    const params = new URLSearchParams(window.location.search);
    
    if (categoryId === 'all') {
      params.delete('category');
    } else {
      params.set('category', categoryId.toUpperCase());
    }
    
    const newUrl = `/vehicles${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  };

  return (
    <div className="w-full px-6 py-16 bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <IoFlash className="text-orange-500" />
            AutoRentPro Fleet Collection
          </div>
          
          {/* Display Search Summary if filters exist */}
          {(searchFilters.pickupDate || searchFilters.returnDate || searchFilters.location || searchFilters.category || searchFilters.search) && (
            <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-200">
              <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FaCalendarAlt className="text-orange-500" />
                Your Search Results
              </h2>
              <div className="flex flex-wrap gap-4">
                {searchFilters.pickupDate && (
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                    <span className="text-gray-600 text-sm">Pickup:</span>
                    <span className="font-semibold text-gray-800">
                      {new Date(searchFilters.pickupDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                )}
                {searchFilters.returnDate && (
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                    <span className="text-gray-600 text-sm">Return:</span>
                    <span className="font-semibold text-gray-800">
                      {new Date(searchFilters.returnDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                )}
                {searchFilters.location && (
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                    <FaMapMarkerAlt className="text-orange-500 text-sm" />
                    <span className="font-semibold text-gray-800">{searchFilters.location}</span>
                  </div>
                )}
                {searchFilters.category && searchFilters.category !== 'all' && (
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                    <span className="text-gray-600 text-sm">Category:</span>
                    <span className="font-semibold text-gray-800 capitalize">{searchFilters.category}</span>
                  </div>
                )}
                {searchFilters.search && (
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                    <FaSearch className="text-orange-500 text-sm" />
                    <span className="font-semibold text-gray-800">"{searchFilters.search}"</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center mt-3">
                <p className="text-gray-600 text-sm">
                  Showing {filteredCars.length} vehicle{filteredCars.length !== 1 ? 's' : ''} matching your criteria
                </p>
                <button 
                  onClick={clearAllFilters}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium hover:bg-orange-50 px-3 py-1 rounded-lg transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
          
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4">
            Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">Latest</span> Fleet
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Discover the perfect vehicle for your journey. From luxury SUVs to economic sedans, 
            find your ideal ride with unbeatable prices and premium service.
          </p>
        </div>

        {/* Enhanced Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {updatedCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`
                group relative flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold 
                transition-all duration-500 ease-out min-w-[140px] overflow-hidden
                ${selectedCategory === category.id
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-2xl shadow-orange-200 transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg hover:shadow-xl border border-gray-100'
                }
              `}
            >
              {/* Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
              
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold capitalize">{category.name}</span>
                <span className={`text-xs ${selectedCategory === category.id ? 'text-orange-100' : 'text-gray-400'}`}>
                  {category.count} cars
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
            <p className="mt-4 text-gray-600">Loading vehicles...</p>
          </div>
        )}

        {/* Cars Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
            {filteredCars.length === 0 ? (
              <div className="col-span-3 text-center py-16">
                <div className="inline-block p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl">
                  <FaCalendarAlt className="text-5xl text-orange-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">No Vehicles Found</h3>
                  <p className="text-gray-600 mb-4">
                    {cars.length === 0 
                      ? "We couldn't load any vehicles. Please try again later." 
                      : "We couldn't find vehicles matching your search criteria."}
                  </p>
                  <button 
                    onClick={clearAllFilters}
                    className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-xl font-bold hover:from-orange-700 hover:to-red-700 transition-all"
                  >
                    {cars.length === 0 ? "Try Again" : "Clear Filters"}
                  </button>
                </div>
              </div>
            ) : (
              filteredCars.map((car) => (
                <div
                  key={car.id}
                  className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-orange-200"
                >
                  {/* Image Header */}
                  <div className="relative h-48 w-full">
                    <Image
                      src={car.img || '/default-car.jpg'}
                      alt={car.name}
                      fill
                      className="object-cover rounded-t-xl"
                      priority
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {car.featured && (
                        <span className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                          FEATURED
                        </span>
                      )}
                      <span className="bg-black/60 text-white px-3 py-1 rounded-full text-xs">
                        {car.year}
                      </span>
                      {car.location && searchFilters.location && car.location.toLowerCase().includes(searchFilters.location.toLowerCase()) && (
                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                          AT LOCATION
                        </span>
                      )}
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(car.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full transition ${
                        favorites.includes(car.id)
                          ? "bg-red-500 text-white scale-110"
                          : "bg-white/90 text-gray-500 hover:bg-white hover:text-red-500"
                      }`}
                    >
                      <FaHeart className="text-sm" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Car Name and Power */}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-black text-gray-900 group-hover:text-orange-600 transition-colors">
                        {car.name}
                      </h3>
                      <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                        <IoFlash className="text-orange-500 text-sm" />
                        <span className="text-xs font-bold text-gray-700">{car.power}</span>
                      </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaGasPump className="text-orange-500" />
                        <span className="text-sm font-medium capitalize">{car.fuelType?.toLowerCase() || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <IoSpeedometer className="text-orange-500" />
                        <span className="text-sm font-medium capitalize">{car.gear?.toLowerCase() || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaUserFriends className="text-orange-500" />
                        <span className="text-sm font-medium">{car.seats} Seats</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FaCog className="text-orange-500" />
                        <span className="text-sm font-medium">{car.drive || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Location if available */}
                    {car.location && (
                      <div className="mb-3 flex items-center gap-2 text-gray-600">
                        <FaMapMarkerAlt className="text-orange-500" />
                        <span className="text-sm">{car.location}</span>
                      </div>
                    )}

                    {/* Price and Button */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <h4 className="text-2xl font-black text-orange-600">
                          Ksh {car.price}
                        </h4>
                        <p className="text-xs text-gray-500 font-medium">per day</p>
                      </div>
                      <button 
                        onClick={() => handleRentNow(car)} 
                        className="group relative bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                      >
                        <span className="relative z-10">Rent Now</span>
                        <div className="absolute inset-0 bg-white bg-opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Enhanced Stats Section */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-8 text-white shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl md:text-5xl font-black mb-2 group-hover:scale-110 transition-transform duration-300">{cars.length}+</div>
              <div className="text-orange-100 font-semibold">Available Now</div>
              <div className="text-orange-200 text-sm mt-1">Premium Fleet</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-black mb-2 group-hover:scale-110 transition-transform duration-300">10+</div>
              <div className="text-orange-100 font-semibold">Categories</div>
              <div className="text-orange-200 text-sm mt-1">Variety Choice</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-black mb-2 group-hover:scale-110 transition-transform duration-300">4</div>
              <div className="text-orange-100 font-semibold">Locations</div>
              <div className="text-orange-200 text-sm mt-1">Easy Pickup</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-black mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
              <div className="text-orange-100 font-semibold">Support</div>
              <div className="text-orange-200 text-sm mt-1">Always Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup Component */}
      <CarRentPopUp
        showPopup={showPopup} 
        selectedCar={selectedCar} 
        closePopup={closePopup} 
      />
    </div>
  );
};

export default AllVehicles;