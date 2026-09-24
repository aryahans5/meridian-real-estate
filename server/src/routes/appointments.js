const express = require('express');
const { body, validationResult } = require('express-validator');
const Appointment = require('../models/Appointment');
const Property = require('../models/Property');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('propertyId').notEmpty().withMessage('Property is required'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('preferredDate').notEmpty().withMessage('Preferred date is required'),
    body('preferredTime').trim().notEmpty().withMessage('Preferred time is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    try {
      const { propertyId, name, email, phone, preferredDate, preferredTime, message } = req.body;
      const property = await Property.findById(propertyId);
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }

      const appointment = await Appointment.create({
        property: propertyId,
        user: req.user._id,
        name,
        email,
        phone,
        preferredDate,
        preferredTime,
        message: message || '',
      });

      const populated = await appointment.populate('property', 'title city address images price listingType');
      res.status(201).json({ appointment: populated });
    } catch (err) {
      res.status(500).json({ message: err.message || 'Failed to schedule visit' });
    }
  }
);

router.get('/mine', protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate('property', 'title city address images price listingType')
      .sort({ preferredDate: 1 });
    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch appointments' });
  }
});

router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('property', 'title city address images price listingType')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json({ appointments });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch appointments' });
  }
});

router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('property', 'title city address images price listingType')
      .populate('user', 'name email');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json({ appointment });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update appointment' });
  }
});

module.exports = router;
