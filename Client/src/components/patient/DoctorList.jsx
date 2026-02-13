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

const DoctorList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParams = searchParams.get("category");

  const { doctors, loading, fetchDoctors } = useDoctorStore();
  const [filters, setFilters] = useState({
    search: "",
    specialisation: "",
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
      specialisation: "",
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
          <div className="pl-24 display-flex flex-col pt-3">
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
            <Button className="h-12">
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

      </div>
    </>
  )
}

export default DoctorList