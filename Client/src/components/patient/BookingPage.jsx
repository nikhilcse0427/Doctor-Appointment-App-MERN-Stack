import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../landing/Header';
import useDoctorStore from '../../store/doctorStore';
import { useAppointmentStore } from '../../store/appointmentStore';
import { userAuthStore } from '../../store/store';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { MapPin, Calendar, Clock, Video, Phone, ArrowLeft } from 'lucide-react';
const CONSULTATION_TYPES = ['Video Consultation', 'Voice Call'];

function getAvailableSlots(doctor, dateStr, bookedSlots) {
  if (!doctor?.dailyTimeRanges?.length) return [];
  const duration = doctor.slotDurationInMinutes || 30;
  const day = new Date(dateStr);
  if (isNaN(day.getTime())) return [];
  const bookedSet = new Set((bookedSlots || []).map((d) => new Date(d).getTime()));

  const slots = [];
  for (const range of doctor.dailyTimeRanges) {
    const [sh, sm] = (range.start || '09:00').split(':').map(Number);
    const [eh, em] = (range.end || '17:00').split(':').map(Number);
    let minutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;
    while (minutes + duration <= endMinutes) {
      const slotStart = new Date(day);
      slotStart.setHours(0, 0, 0, 0);
      slotStart.setMinutes(slotStart.getMinutes() + minutes);
      const slotEnd = new Date(slotStart.getTime() + duration * 60 * 1000);
      if (slotStart >= new Date()) {
        const key = slotStart.getTime();
        if (!bookedSet.has(key)) slots.push({ start: slotStart, end: slotEnd });
      }
      minutes += duration;
    }
  }
  return slots.sort((a, b) => a.start - b.start);
}

function formatSlot(d) {
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export default function BookingPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { user } = userAuthStore();
  const { currentDoctor, loading: doctorLoading, fetchDoctorById } = useDoctorStore();
  const { fetchBookedSlots, bookAppointment, bookedSlots, loading: bookLoading } = useAppointmentStore();

  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [consultationType, setConsultationType] = useState('Video Consultation');
  const [symptoms, setSymptoms] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Allow viewing booking page even when not logged in.
    // Fetch doctor details regardless of auth state so users can see availability.
    if (doctorId) fetchDoctorById(doctorId);
  }, [doctorId, user, navigate, fetchDoctorById]);

  useEffect(() => {
    if (!doctorId || !selectedDate) return;
    fetchBookedSlots(doctorId, selectedDate);
  }, [doctorId, selectedDate, fetchBookedSlots]);

  const availableSlots = getAvailableSlots(currentDoctor, selectedDate, bookedSlots);

  const minDate = new Date();
  minDate.setDate(minDate.getDate());
  const minDateStr = minDate.toISOString().slice(0, 10);

  const handleBook = async () => {
    setError('');
    if (!currentDoctor || !selectedSlot || symptoms.trim().length < 10) {
      setError('Please select a slot and enter symptoms (min 10 characters).');
      return;
    }
    const consultationFees = Number(currentDoctor.fees) || 0;
    const platformFees = 0;
    const totalAmount = consultationFees + platformFees;
    try {
      // persist pending booking so we can resume after login if needed
      const pending = {
        doctorId: currentDoctor._id,
        date: selectedDate,
        slotStartIso: selectedSlot.start.toISOString(),
        slotEndIso: selectedSlot.end.toISOString(),
        consultationType,
        symptoms: symptoms.trim(),
        consultationFees,
        platformFees,
        totalAmount,
      };
      sessionStorage.setItem('pendingBooking', JSON.stringify(pending));
      const appointment = await bookAppointment({
        doctorId: currentDoctor._id,
        date: selectedDate,
        slotStartIso: selectedSlot.start.toISOString(),
        slotEndIso: selectedSlot.end.toISOString(),
        consultationType,
        symptoms: symptoms.trim(),
        consultationFees,
        platformFees,
        totalAmount,
      });
      // remove pending on success
      sessionStorage.removeItem('pendingBooking');
      navigate('/patient/booking/payment', { state: { appointment } });
    } catch (err) {
      const msg = err?.message || '';
      // if auth error, redirect to login and allow resume
      if (msg.includes('401') || /unauthorized/i.test(msg) || /access denied/i.test(msg)) {
        navigate('/login/patient', { state: { redirectTo: `/patient/booking/${doctorId}` } });
        return;
      }
      setError(msg || 'Booking failed');
    }
  };

  // If there's a pending booking (saved before redirect to login) and user is logged in, try to complete it
  useEffect(() => {
    const tryPending = async () => {
      const raw = sessionStorage.getItem('pendingBooking');
      if (!raw) return;
      if (!user || user.type !== 'patient') return;
      try {
        const pending = JSON.parse(raw);
        // ensure this booking is for the same doctor page
        if (String(pending.doctorId) !== String(doctorId)) return;
        // attempt to create appointment
        const appointment = await bookAppointment(pending);
        sessionStorage.removeItem('pendingBooking');
        navigate('/patient/booking/payment', { state: { appointment } });
      } catch (err) {
        // if still failing due to auth, redirect to login again; otherwise show error
        const msg = err?.message || '';
        if (msg.includes('401') || /unauthorized/i.test(msg) || /access denied/i.test(msg)) {
          navigate('/login/patient', { state: { redirectTo: `/patient/booking/${doctorId}` } });
          return;
        }
        setError(msg || 'Failed to complete pending booking');
      }
    };
    tryPending();
    // run when user or doctorId changes
  }, [user, doctorId, bookAppointment, navigate]);

  // allow anonymous users to view booking page; require login only to confirm booking

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Header showDashboardNav={true} />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Link to="/doctor-list" className="inline-flex items-center text-blue-600 hover:underline mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to doctors
        </Link>

        {doctorLoading && !currentDoctor ? (
          <Card><CardContent className="p-8">Loading doctor...</CardContent></Card>
        ) : !currentDoctor ? (
          <Card><CardContent className="p-8">Doctor not found.</CardContent></Card>
        ) : (
          <>
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={currentDoctor.profileImg} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">{currentDoctor.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">{currentDoctor.name}</h1>
                    <p className="text-gray-600">{currentDoctor.specialisation || currentDoctor.specialization}</p>
                    {currentDoctor.hospitalInfo?.name && (
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <MapPin className="w-3 h-3" /> {currentDoctor.hospitalInfo.name}, {currentDoctor.hospitalInfo.city}
                      </div>
                    )}
                    <p className="text-lg font-semibold text-green-600 mt-2">₹{currentDoctor.fees} per consultation</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 1: Date */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" /> Choose date
                </h2>
                <Input
                  type="date"
                  min={minDateStr}
                  value={selectedDate}
                  onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(null); }}
                />
              </CardContent>
            </Card>

            {/* Step 2: Slot */}
            {selectedDate && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" /> Available slots
                  </h2>
                  {availableSlots.length === 0 ? (
                    <p className="text-gray-500">No slots available for this date. Try another day.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot.start.getTime()}
                          variant={selectedSlot?.start.getTime() === slot.start.getTime() ? 'default' : 'outline'}
                          onClick={() => setSelectedSlot(slot)}
                        >
                          {formatSlot(slot.start)}
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 3: Consultation & symptoms */}
            {selectedSlot && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Consultation type & symptoms</h2>
                  <div className="flex gap-2 mb-4">
                    {CONSULTATION_TYPES.map((type) => (
                      <Button
                        key={type}
                        variant={consultationType === type ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setConsultationType(type)}
                      >
                        {type === 'Video Consultation' ? <Video className="w-4 h-4 mr-1" /> : <Phone className="w-4 h-4 mr-1" />}
                        {type}
                      </Button>
                    ))}
                  </div>
                  <Label>Symptoms / reason for visit (min 10 characters)</Label>
                  <Textarea
                    className="mt-2"
                    rows={4}
                    placeholder="Describe your symptoms or reason for consultation..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    minLength={10}
                  />
                  {symptoms.length > 0 && symptoms.length < 10 && (
                    <p className="text-amber-600 text-sm mt-1">Please enter at least 10 characters.</p>
                  )}
                </CardContent>
              </Card>
            )}

            {error && <p className="text-red-600 mb-4">{error}</p>}

            {selectedSlot && (
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => navigate('/doctor-list')}>Cancel</Button>
                <Button
                  disabled={symptoms.trim().length < 10 || bookLoading}
                  onClick={handleBook}
                >
                  {bookLoading ? 'Booking...' : `Confirm & Pay ₹${currentDoctor.fees}`}
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
