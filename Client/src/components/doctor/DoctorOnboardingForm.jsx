import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

// Use the central auth store
import { userAuthStore } from "../../store/store";
// Constants (healthcare categories & doctor specializations)
import { healthcareCategoriesList, specializations } from "../../lib/constants";

const DoctorOnboardingForm = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    specialization: "",
    categories: [],
    qualification: "",
    experience: "",
    fees: "",
    about: "",
    hospitalInfo: {
      name: "",
      address: "",
      city: "",
    },
    availabilityRange: {
      startDate: "",
      endDate: "",
      excludedWeekdays: [],
    },
    dailyTimeRanges: [
      { start: "09:00", end: "12:00" },
      { start: "14:00", end: "17:00" },
    ],
    slotDurationMinutes: 30,
  });

  const { updateProfile, loading } = userAuthStore();
  const navigate = useNavigate();

  // ---------------------------------------
  //  CATEGORY SELECT
  // ---------------------------------------
  const handleCategoryToggle = (category) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  // ---------------------------------------
  //  GENERIC INPUT HANDLER
  // ---------------------------------------
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ---------------------------------------
  //  HOSPITAL INFO
  // ---------------------------------------
  const handleHospitalInfoChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      hospitalInfo: {
        ...prev.hospitalInfo,
        [field]: value,
      },
    }));
  };

  // ---------------------------------------
  //  SUBMIT
  // ---------------------------------------
  const handleSubmit = async () => {
    try {
      await updateProfile({
        specialization: formData.specialization,
        category: formData.categories,
        qualification: formData.qualification,
        experience: formData.experience,
        about: formData.about,
        fees: formData.fees,
        hospitalInfo: formData.hospitalInfo,
        availabilityRange: {
          startDate: new Date(formData.availabilityRange.startDate),
          endDate: new Date(formData.availabilityRange.endDate),
          excludedWeekdays: formData.availabilityRange.excludedWeekdays,
        },
        dailyTimeRanges: formData.dailyTimeRanges,
        slotDurationMinutes: formData.slotDurationMinutes,
      });

      navigate("/doctor/dashboard");
    } catch (error) {
      console.error("Profile update failed", error);
    }
  };

  // ---------------------------------------
  //  STEPPER HANDLERS
  // ---------------------------------------
  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // ---------------------------------------
  //  UI
  // ---------------------------------------
  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="shadow-lg w-full max-w-2xl mx-auto mt-15">
        <CardContent className="p-8">
          {/* ---------------------- STEP 1 ---------------------- */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">
                Professional Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="specialization">Medical Specialization</Label>

                  <Select
                    value={formData.specialization}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        specialization: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {specializations.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    name="experience"
                    type="number"
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="5"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <Label>Healthcare Categories</Label>
                <p className="text-sm text-gray-600">
                  Select at least one category
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {healthcareCategoriesList.map((category) => (
                    <div className="flex items-center space-x-2" key={category}>
                      <Checkbox
                        checked={formData.categories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <label className="text-sm font-medium cursor-pointer">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* More fields */}
              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification</Label>
                <Input
                  id="qualification"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about">About You</Label>
                <Input
                  id="about"
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fees">Consultation Fees (₹)</Label>
                <Input
                  id="fees"
                  name="fees"
                  type="number"
                  value={formData.fees}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          {/* ---------------------- STEP 2 ---------------------- */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">
                Hospital / Clinic Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* NAME */}
                <div className="space-y-2 md:col-span-2">
                  <Label>Hospital/Clinic Name</Label>
                  <Input
                    value={formData.hospitalInfo.name}
                    onChange={(e) =>
                      handleHospitalInfoChange("name", e.target.value)
                    }
                  />
                </div>

                {/* ADDRESS */}
                <div className="space-y-2 md:col-span-2">
                  <Label>Address</Label>
                  <Textarea
                    value={formData.hospitalInfo.address}
                    onChange={(e) =>
                      handleHospitalInfoChange("address", e.target.value)
                    }
                  />
                </div>

                {/* CITY */}
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    value={formData.hospitalInfo.city}
                    onChange={(e) =>
                      handleHospitalInfoChange("city", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* ---------------------- STEP 3 ---------------------- */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">
                Availability Settings
              </h2>

              {/* DATE RANGE */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Available From</Label>
                  <Input
                    type="date"
                    value={formData.availabilityRange.startDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        availabilityRange: {
                          ...prev.availabilityRange,
                          startDate: e.target.value,
                        },
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Available Until</Label>
                  <Input
                    type="date"
                    value={formData.availabilityRange.endDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        availabilityRange: {
                          ...prev.availabilityRange,
                          endDate: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              </div>

              {/* Slot Duration */}
              <div className="space-y-2">
                <Label>Slot Duration</Label>
                <Select
                  value={String(formData.slotDurationMinutes)}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      slotDurationMinutes: Number(value),
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {[15, 20, 30, 45, 60, 90, 120].map((min) => (
                      <SelectItem key={min} value={String(min)}>
                        {min} minutes
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Working Days */}
              <div className="space-y-3">
                <Label>Working Days</Label>

                <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                  {[
                    "Sun",
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                  ].map((day, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Checkbox
                        checked={formData.availabilityRange.excludedWeekdays.includes(
                          idx
                        )}
                        onCheckedChange={(checked) => {
                          setFormData((prev) => ({
                            ...prev,
                            availabilityRange: {
                              ...prev.availabilityRange,
                              excludedWeekdays: checked
                                ? [...prev.availabilityRange.excludedWeekdays, idx]
                                : prev.availabilityRange.excludedWeekdays.filter(
                                  (d) => d !== idx
                                ),
                            },
                          }));
                        }}
                      />
                      <label className="text-sm">{day}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Time Ranges */}
              <div className="space-y-4">
                <Label>Daily Time Sessions</Label>

                {formData.dailyTimeRanges.map((range, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        value={range.start}
                        onChange={(e) => {
                          const updated = [...formData.dailyTimeRanges];
                          updated[index].start = e.target.value;

                          setFormData((prev) => ({
                            ...prev,
                            dailyTimeRanges: updated,
                          }));
                        }}
                      />
                    </div>

                    <div className="flex-1">
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        value={range.end}
                        onChange={(e) => {
                          const updated = [...formData.dailyTimeRanges];
                          updated[index].end = e.target.value;

                          setFormData((prev) => ({
                            ...prev,
                            dailyTimeRanges: updated,
                          }));
                        }}
                      />
                    </div>

                    {formData.dailyTimeRanges.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const updated = formData.dailyTimeRanges.filter(
                            (_, i) => i !== index
                          );

                          setFormData((prev) => ({
                            ...prev,
                            dailyTimeRanges: updated,
                          }));
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  variant="outline"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      dailyTimeRanges: [
                        ...prev.dailyTimeRanges,
                        { start: "18:00", end: "20:00" },
                      ],
                    }))
                  }
                >
                  + Add Session
                </Button>
              </div>
            </div>
          )}

          {/* ---------------------- FOOTER BUTTONS ---------------------- */}
          <div className="flex justify-between pt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            {currentStep < 3 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? "Completing Setup..." : "Complete Profile"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorOnboardingForm;
