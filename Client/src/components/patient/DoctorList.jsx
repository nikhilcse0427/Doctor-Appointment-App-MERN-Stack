import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"
import { useDoctorStore } from '../store/doctorStore.js'
import Header from "../landing/Header";

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

  const activeFilterCount = Object.values(filters).filter((value) => value && value !== "experience" && value !== "desc").length;

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-16">
        <Header />

      </div>
    </>
  )
}

export default DoctorList