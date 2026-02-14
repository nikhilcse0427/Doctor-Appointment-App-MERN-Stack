import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom"
import useDoctorStore from '../../store/doctorStore.js'
import Header from "../landing/Header";
import { Search, Funnel, X, Star, MapPin } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { Button } from "../ui/button.jsx";
import { Badge } from "@/components/ui/badge"
import { healthcareCategories, healthCareCategoriesList } from "@/lib/constants.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { specializations, cities } from "@/lib/constants.js";
import { Label } from "../ui/label.jsx";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"



const DoctorList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
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

  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchDoctors(filters);
  }, [fetchDoctors, filters]);

  const clearFilters = () => {
    setFilters({
      search: "",
      specialization: "",
      category: "",
      city: "",
      sortBy: "experience",
      sortOrder: "desc",
    });
  }

  const activeFilterCount = Object.values(filters).filter((value) => value !== "" && value !== "experience" && value !== "desc").length;

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      return {
        ...prev,
        [key]: value,
      }
    })
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100 pt-16">
        <Header />
        <div className="border-md">
          <div className="pl-24 flex flex-col pt-3">
            <h1 className="text-3xl font-bold">Choose your doctor</h1>
            <p className="text-1xl">
              Find the perfect healthcare provider for your needs
            </p>
          </div>
        </div>

        <div className="flex flex-1 pl-24 gap-4 mt-5">
          <div className="relative w-300 flex items-center">
            <Search className="absolute left-5  text-gray" />
            <Input
              className="pl-15 h-12 border-black text-2xl"
              placeholder="Search doctors by name , specialization, or condition..."
              value={filters.search || ""}
              onChange={(e) => {
                handleFilterChange("search", e.target.value)
              }}
            />
          </div>
          <div className="absolute right-30 h-12">
            <Button
              onClick={() => {
                return showFilters ? setShowFilters(false) : setShowFilters(true)
              }}
              className="h-12">
              <Funnel />
              Filters
              {
                activeFilterCount > 0 && (
                  <Badge variant="destructive">{activeFilterCount}</Badge>
                )
              }
            </Button>
          </div>

        </div>

        <div className="mt-3 pl-24 w-350">
          <h3 className="text-xl font-md">Browse my category</h3>
          <div className="flex gap-x-3 mt-3 overflow-x-auto pb-2 scrollbar-hide flex-nowrap">
            <Button
              variant={filters.category === "" ? "default" : "outline"}
              className="rounded-full whitespace-nowrap"
              onClick={() => handleFilterChange("category", "")}
            >
              All Category
            </Button>
            {healthcareCategories.map((cat) => (
              <Button
                key={cat.id}
                variant={filters.category === cat.title ? "default" : "outline"}
                className="rounded-full flex items-center gap-2 whitespace-nowrap"
                onClick={() => handleFilterChange("category", cat.title)}
              >
                <div className={`w-6 h-6 ${cat.color} rounded-full flex items-center justify-center`}>
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d={cat.icon} />
                  </svg>
                </div>
                {cat.title}
              </Button>
            ))}
          </div>
        </div>

        {showFilters && (
          <Card className="ml-24 mr-28 mt-3">
            <CardHeader className="flex flex-row items-center justify-between px-8 py-4">
              <CardTitle>Advance Filters</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFilters(false)}
                className="hover:bg-gray-200 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="flex flex-wrap justify-start gap-60 px-8 pb-6">
              <div>
                <label className="text-sm font-medium pl-3 mb-2 block">
                  Specialization
                </label>
                <Select
                  value={filters.specialization || ""}
                  onValueChange={(value) => handleFilterChange("specialization", value)}
                >
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {/* Changed specialisation to specializations */}
                      {specializations.map((spec, idx) => (
                        <SelectItem value={spec} key={idx}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium pl-3 mb-2 block">
                  Location
                </label>
                <Select
                  value={filters.city || ""}
                  onValueChange={(value) => handleFilterChange("city", value)}
                >
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {/* Changed specialisation to specializations */}
                      {cities.map((city, idx) => (
                        <SelectItem value={city} key={idx}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Sort by
                </label>
                <Select
                  value={filters.sortBy || "experience"}
                  onValueChange={(value) =>
                    handleFilterChange("sortBy", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="experience">Experience</SelectItem>
                    <SelectItem value="fees">Consultation Fee</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="createdAt">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Button
                  onClick={clearFilters}
                  variant="default"
                  className="mt-7"
                >Clear all Filter</Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 px-24 py-8">
          {/** Num of doctors */}
          <div className="flex items-center justify-between mb-6">
            <Label className="text-lg font-semibold text-gray-700">
              {loading ? "Searching for doctors..." : `${doctors.length} Doctors found`}
            </Label>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse border-none shadow-sm">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto"></div>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3 mx-auto"></div>
                        <div className="h-10 bg-gray-200 rounded mt-4"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : doctors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors.map((doctor) => (
                <Card
                  key={doctor._id}
                  className="group hover:shadow-2xl transition-all duration-300 bg-white border-0 shadow-lg rounded-2xl overflow-hidden flex flex-col h-full"
                >
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className="text-center mb-6">
                      <div className="relative inline-block mb-4">
                        <Avatar className="w-24 h-24 mx-auto border-4 border-blue-50 group-hover:border-blue-100 transition-colors">
                          <AvatarImage
                            src={doctor.profileImg || doctor.profileImage}
                            alt={doctor.name}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-2xl font-bold">
                            {doctor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-4 border-white"></div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors mb-1">
                        {doctor.name}
                      </h3>
                      <p className="text-blue-600 font-medium text-sm mb-2">
                        {doctor.specialization}
                      </p>

                      <div className="flex items-center justify-center gap-1.5 text-gray-500 text-xs mb-3">
                        <span className="font-semibold text-gray-700">{doctor.experience} years</span>
                        <span>•</span>
                        <span>Experience</span>
                      </div>

                      <div className="flex items-center justify-center space-x-1 mb-4">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="w-4 h-4 fill-amber-400 text-amber-400"
                            />
                          ))}
                        </div>
                        <span className="font-bold text-gray-900 ml-1">5.0</span>
                        <span className="text-gray-400 text-xs"> (620 reviews)</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                      {(Array.isArray(doctor.category) ? doctor.category : []).slice(0, 2).map((category, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="bg-blue-50 text-blue-700 border-none px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
                        >
                          {category}
                        </Badge>
                      ))}

                      <Badge
                        variant="secondary"
                        className="bg-amber-50 text-amber-700 border-none px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
                      >
                        <Star className="w-3 h-3 mr-1 fill-amber-700" />
                        Popular
                      </Badge>
                    </div>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center justify-center text-gray-600 bg-gray-50 rounded-lg py-2 px-4 border border-gray-100">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-sm font-medium">{doctor.hospitalInfo.city}</span>
                      </div>

                      <div className="flex justify-between items-center py-2 px-4">
                        <span className="text-gray-500 text-sm">Consultation</span>
                        <span className="font-bold text-green-600 text-xl">₹{doctor.fees}</span>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <Link to={`/patient/booking/${doctor._id}`} className="block">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 text-base font-semibold shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                          Book Appointment
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-20 text-center border-dashed border-2 border-gray-200 bg-gray-50/50 rounded-3xl">
              <div className="text-gray-300 mb-6">
                <Search className="w-20 h-20 mx-auto" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No doctors found</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-8">
                We couldn't find any healthcare providers matching your current search or filter criteria.
              </p>
              <Button
                onClick={clearFilters}
                className="bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 px-8 rounded-full"
              >
                Clear all filters
              </Button>
            </Card>
          )}
        </div>


      </div>
    </>
  )
}

export default DoctorList