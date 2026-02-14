import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"
import useDoctorStore from '../../store/doctorStore.js'
import Header from "../landing/Header";
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { Button } from "../ui/button.jsx";
import { Funnel } from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import { healthcareCategories, healthCareCategoriesList } from "@/lib/constants.js";
import { X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { specializations, cities } from "@/lib/constants.js";

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
                return showFilters?setShowFilters(false):setShowFilters(true)
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


      </div>
    </>
  )
}

export default DoctorList