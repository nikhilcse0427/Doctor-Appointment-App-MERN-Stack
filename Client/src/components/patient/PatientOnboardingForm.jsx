import { userAuthStore } from '@/store/store';
import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import {Card, CardContent} from '../ui/card'
import { User, Phone, Heart } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { Textarea } from "../ui/textarea";
import { Button } from '../ui/button';

const PatientOnboardingForm = () => {
  const [currentStep, setCurrentStep] = useState(3);

  const [formData, setFormData] = useState({
    phoneNumber: "",
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
  })

  const {updateProfile, user, loading} = userAuthStore();

  const handleInputChange = (e)=>{
    const {name, value} = e.target;
    setFormData((prev)=>({...prev, [name]:value}));
  }

  const handleSelectChange = (name, value)=>{
    setFormData((prev)=>({...prev, [name]:value}))
  }

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

  const navigate = useNavigate();
  return (
    <div className='h-full w-full flex flex-col justify-center items-center'>
      
    <div className=' max-auto mt-15'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
          Welcome {user?.name} to Narayana
        </h1>
        <p className='text-gray-700'>
          Complete your profile to start booking appointment
        </p>
      </div>
      
      {/* Stepper */}
      <div className='flex justify-center items-center'>
        <div className='flex items-center'>
          {
            [1,2,3].map((step)=>(
              <div key={step} className='flex items-center'>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep > step?"bg-black text-white font-bold":"bg-white border-gray-600"}`}>{step}</div>
                {step < 3 && (
                <div
                  className={`w-20 h-1 ${
                    currentStep > step ? "bg-black" : "bg-gray-300"
                  }`}
                ></div>
              )}
              </div>
            ))
          }
        </div>
      </div>
      

      <Card className="shallow-lg mt-5 w-full max-w-2xl">
        <CardContent className="p-8">

          {/* ================= step 1 ================ */}
          {
            currentStep == 1 && (
              <div className='space-y-6'>
                <div className='flex items-center space-x-2 mb-2'>
                  <User className='h-7 w-7 text-black' />
                  <h1 className='text-gray-600 text-2xl font-semibold'>Basic Information</h1>
                </div>

                <div className='grid md:grid-cols-2 gap-6'>
                  <div className='space-y-2 mt-3'>
                    <Label htmlFor='phoneNumber'>Phone Number</Label>
                    <Input
                    name='phoneNumber'
                    id='phoneNumber'
                    type='tel'
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+91 9876543210"        
                    />
                  </div>

                  <div className='space-y-2 mt-3'>
                  <Label htmlFor='dob'>Date of Birth</Label>
                  <Input 
                  type='date'
                  id='dob'
                  name='dob'
                  value={formData.dob}
                  onChange={handleInputChange}
                  />
                  </div>

                  <div className='space-y-2 mt-3'>
                    <Label>Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value)=>handleSelectChange("gender", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Male">FeMale</SelectItem>
                          <SelectItem value="Male">Others</SelectItem>
                        </SelectContent>
                      </Select>
                  </div>

                  <div className='space-y-2 mt-3'>
                    <Label>Blood Group</Label>
                    <Select value={formData.gender} 
                    onValueChange={(value)=>handleSelectChange("gender", value)}>
                      
                        <SelectTrigger>
                          <SelectValue placeholder='Select Blood Group' />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value='A+'>A+</SelectItem>
                          <SelectItem value='A-'>A-</SelectItem>

                          <SelectItem value='B+'>B+</SelectItem>
                          <SelectItem value='B-'>B-</SelectItem>

                          <SelectItem value='O+'>O+</SelectItem>
                          <SelectItem value='O-'>O-</SelectItem>

                          <SelectItem value='AB+'>AB+</SelectItem>
                          <SelectItem value='AB-'>AB-</SelectItem>

                      </SelectContent>
                    </Select>

                  </div>

                </div>
              </div>
            )
          }

          {/* ==================== step 2 ================= */}
          {
            currentStep === 2 && (
              <div className='space-y-6'>
                <div className='flex items-center space-x-2 mb-6'>
                  <Phone className=' text-black' />
                   <h1 className='text-gray-600 text-2xl font-semibold'>Emergency Contact</h1>
                </div>
                <Alert>
                  <AlertDescription>
                    This contact will be used in case of an emergency to quickly reach a trusted person who can assist or provide important information about you.
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
            )
          }

           {/* ================= Step 3 ================== */}
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <div className="flex items-center space-x-2 mb-6">
                          <Heart className="w-5 h-5  text-black" />
                          <h2 className="text-xl font-semibold">Medical Information</h2>
                        </div>
          
                        <Alert>
                          <AlertDescription>
                            Your details help doctors personalize your care.
                          </AlertDescription>
                        </Alert>
          
                        <div className="space-y-4">
                          <div className='space-y-2'>
                            <Label>Known Allergies</Label>
                            <Textarea
                              value={formData.medicalHistory.allergies}
                              onChange={(e) =>
                                handleMedicalHistoryChnage("allergies", e.target.value)
                              }
                              rows={3}
                            />
                          </div>
          
                          <div className='space-y-2'>
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
          
                          <div className='space-y-2'>
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
                                    className="bg-black"
                                  >
                                    {loading ? "Completing..." : "Complete Profile"}
                                  </Button>
                                )}
                              </div>

        </CardContent>
      </Card>
      
      </div>
  )
}

export default PatientOnboardingForm
