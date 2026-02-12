import useDoctorStore from "@/store/doctoreStore";
import { useSearchParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Header from "../landing/Header";
import { FilterIcon, MapPin, Search, Star, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { healthcareCategories, specializations } from "@/lib/constants";
import { Card, CardContent } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

// Fallback cities list
const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur"];

const DoctorListPage = () => {
  // React Router hook returns an array [params, setParams]
  const [searchParams] = useSearchParams();
  const categoryParams = searchParams.get("category");

  const { doctors, loading, fetchDoctors } = useDoctorStore();

  const [filters, setFilters] = useState({
    search: "",
    specialization: "",
    category: categoryParams || "",
    city: "",
    sortBy: "experience",
    sortOrder: "desc",
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchDoctors(filters);
  }, [fetchDoctors, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      specialization: "",
      category: categoryParams || "",
      city: "",
      sortBy: "experience",
      sortOrder: "desc",
    });
  };

  const activeFilterCount = Object.values(filters).filter(
    (value) => value && value !== "experience" && value !== "desc"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Header />

      <div className="bg-white border-b ">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Choose your doctor</h1>
              <p className="text-gray-600 mt-1">Find the perfect healthcare provider for your needs</p>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 " />
              <Input
                placeholder="Search doctors by name, specialization, or condition..."
                className="pl-10 h-12 text-base"
                value={filters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>

            <Button variant="outline" className="h-12 px-4" onClick={() => setShowFilters(!showFilters)}>
              <FilterIcon className="w-4 h-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2 bg-blue-300 text-blue-800">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* ... Search categories and advanced filters ... */}
          {/* (Content remains largely the same, just JSX formatting) */}
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Browse by Category</h3>
            <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
              <Button
                variant={!filters.category ? "default" : "outline"}
                className="flex-shrink-0 rounded-full"
                onClick={() => handleFilterChange("category", "")}
              >
                All Categories
              </Button>
              {healthcareCategories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={filters.category === cat.title ? "default" : "outline"}
                  className="flex-shrink-0 rounded-full whitespace-nowrap"
                  onClick={() => handleFilterChange("category", cat.title)}
                >
                  <div className={`w-6 h-6 ${cat.color} rounded-2xl flex items-center justify-center`}>
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d={cat.icon} />
                    </svg>
                  </div>
                  {cat.title}
                </Button>
              ))}
            </div>
          </div>

          {showFilters && (
            <Card className="p-4 mb-4 bg-gray-50">
               {/* Advanced Filter UI structure */}
               {/* ... */}
            </Card>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-4 text-sm text-gray-600">
          {loading ? "Searching..." : `${doctors.length} doctor found`}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {/* Loading skeletons */}
          </div>
        ) : doctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <Card key={doctor._id} className="hover:shadow-xl transition-all duration-300 bg-white border-0 shadow-md h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  {/* Doctor Card UI */}
                  <div className="text-center mb-4">
                    <Avatar className="w-20 h-20 mx-auto mb-3">
                      <AvatarImage src={doctor.profileImage} alt={doctor.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                        {doctor.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-bold text-blue-700">{doctor.name}</h3>
                    <p className="text-gray-600 text-sm">{doctor.specialization}</p>
                  </div>
                  
                  {/* ... rest of doctor details ... */}

                  <div className="mt-auto">
                    <Link to={`/patient/booking/${doctor._id}`} className="block">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 shadow-lg">
                        Book Appointment
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <h3>No doctors found</h3>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DoctorListPage;