import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userAuthStore } from "@/store/authStore";
import { Phone, User } from "lucide-react";

import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { Textarea } from "../ui/textarea";

const PatientOnboardingForm = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    phone: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
    medicalHistory: {
      allergies: "",
      currentMedications: "",
      chronicConditions: "",
    },
  });

  const { updateProfile, user, loading } = userAuthStore();
  const navigate = useNavigate();

  const handleInputChnage = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmergencyContactChnage = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value,
      },
    }));
  };

  const handleMedicalHistoryChnage = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      await updateProfile({
        Phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        emergencyContact: formData.emergencyContact,
        medicalHistory: formData.medicalHistory,
      });

      navigate("/");
    } catch (error) {
      console.error("Profile update failed", error);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome {user?.name} to MediCare+
        </h1>
        <p className="text-gray-600">
          Complete your profile to start booking appointment
        </p>
      </div>

      {/* Progress step */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                {step}
              </div>

              {step < 3 && (
                <div
                  className={`w-20 h-1 ${
                    currentStep > step ? "bg-blue-600" : "bg-gray-300"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Card className="shadow-lg">
        <CardContent className="p-8">

          {/* ================= Step 1 ================== */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Basic Information</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Phone */}
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChnage}
                    placeholder="+91 9876543210"
                  />
                </div>

                {/* DOB */}
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleInputChnage}
                  />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      handleSelectChange("gender", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Blood Group */}
                <div className="space-y-2">
                  <Label>Blood Group</Label>
                  <Select
                    value={formData.bloodGroup}
                    onValueChange={(value) =>
                      handleSelectChange("bloodGroup", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* ================= Step 2 ================== */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <Phone className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Emergency Contact</h2>
              </div>

              <Alert>
                <AlertDescription>
                  This contact will be used in case of emergency.
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label>Contact Name</Label>
                  <Input
                    value={formData.emergencyContact.name}
                    onChange={(e) =>
                      handleEmergencyContactChnage("name", e.target.value)
                    }
                    placeholder="Full name"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Contact Phone</Label>
                  <Input
                    value={formData.emergencyContact.phone}
                    onChange={(e) =>
                      handleEmergencyContactChnage("phone", e.target.value)
                    }
                    placeholder="+91 9876543210"
                  />
                </div>
                

                <div className="space-y-2">
                  <Label>Relationship</Label>
                  <Select
                    value={formData.emergencyContact.relationship}
                    onValueChange={(value) =>
                      handleEmergencyContactChnage("relationship", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="relative">Relative</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* ================= Step 3 ================== */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <Phone className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Medical Information</h2>
              </div>

              <Alert>
                <AlertDescription>
                  Your details help doctors personalize your care.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label>Known Allergies</Label>
                  <Textarea
                    value={formData.medicalHistory.allergies}
                    onChange={(e) =>
                      handleMedicalHistoryChnage("allergies", e.target.value)
                    }
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Current Medications</Label>
                  <Textarea
                    value={formData.medicalHistory.currentMedications}
                    onChange={(e) =>
                      handleMedicalHistoryChnage(
                        "currentMedications",
                        e.target.value
                      )
                    }
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Chronic Conditions</Label>
                  <Textarea
                    value={formData.medicalHistory.chronicConditions}
                    onChange={(e) =>
                      handleMedicalHistoryChnage(
                        "chronicConditions",
                        e.target.value
                      )
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========= Navigation Buttons ========= */}
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
                {loading ? "Completing..." : "Complete Profile"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientOnboardingForm;
