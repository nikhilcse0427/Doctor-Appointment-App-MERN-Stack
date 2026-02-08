import crypto from 'crypto';
import Razorpay from 'razorpay';
import Appointment from '../models/appointment.model.js';
import ApiError from '../utils/Api_Errors.js';

function getRazorpayInstance() {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
  if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
    try {
      return new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
    } catch (e) {
      console.error('Failed to create Razorpay instance:', e.message || e);
      return null;
    }
  }
  return null;
}

const selectDoctor = 'name specialisation';
const selectPatient = 'name email phoneNumber';

export const createOrder = async (req, res, next) => {
  try {
    const razorpay = getRazorpayInstance();
    if (!razorpay) throw new ApiError(500, 'Payment not configured');
    const { appointmentId } = req.body;
    const appointment = await Appointment.findById(appointmentId)
      .populate('doctorId', selectDoctor)
      .populate('patientId', selectPatient);
    if (!appointment) throw new ApiError(404, 'Appointment not found');
    if (appointment.patientId._id.toString() !== req.auth.id) throw new ApiError(403, 'Access denied');
    if (appointment.paymentStatus === 'Paid') throw new ApiError(400, 'Payment already completed');

    const order = await razorpay.orders.create({
      amount: appointment.totalAmount * 100,
      currency: 'INR',
      receipt: `appointment_${appointmentId}`,
      notes: {
        appointmentId: appointmentId.toString(),
        doctorName: appointment.doctorId.name,
        patientName: appointment.patientId.name,
        consultationType: appointment.consultationType,
        date: appointment.date,
        slotStart: appointment.slotStartIso,
        slotEnd: appointment.slotEndIso,
      },
    });
    return res.status(200).json({
      success: true,
      message: 'Payment order created successfully',
      data: {
        orderId: order.id,
        amount: appointment.totalAmount,
        currency: 'INR',
        key: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    next(new ApiError(500, error.message));
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { appointmentId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const appointment = await Appointment.findById(appointmentId)
      .populate('doctorId', selectDoctor)
      .populate('patientId', selectPatient);
    if (!appointment) throw new ApiError(404, 'Appointment not found');
    if (appointment.patientId._id.toString() !== req.auth.id) throw new ApiError(403, 'Access denied');

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');
    if (expectedSignature !== razorpay_signature) throw new ApiError(400, 'Payment verification failed');

    appointment.paymentStatus = 'Paid';
    appointment.paymentMethod = 'RazorPay';
    appointment.razorpayPaymentId = razorpay_payment_id;
    appointment.razorpayOrderId = razorpay_order_id;
    appointment.razorpaySignature = razorpay_signature;
    appointment.paymentDate = new Date();
    await appointment.save();
    await appointment.populate('doctorId', 'name specialisation fees hospitalInfo profileImg');
    await appointment.populate('patientId', 'name email phoneNumber profileImg');

    return res.status(200).json({
      success: true,
      message: 'Payment verified and appointment confirmed successfully',
      data: appointment,
    });
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    next(new ApiError(500, error.message));
  }
};
