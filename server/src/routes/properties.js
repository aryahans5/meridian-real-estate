const express = require('express');
const { body, validationResult } = require('express-validator');
const Property = require('../models/Property');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

const propertyValidators = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('listingType').isIn(['buy', 'rent', 'commercial']).withMessage('Invalid listing type'),
  body('bedrooms').isInt({ min: 0 }).withMessage('Bedrooms must be a number'),
  body('bathrooms').isFloat({ min: 0 }).withMessage('Bathrooms must be a number'),
  body('area').isFloat({ min: 0 }).withMessage('Area must be a number'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('zip').trim().notEmpty().withMessage('ZIP is required'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
];

router.get('/', async (req, res) => {
  try {
    const {
      q,
      listingType,
      minPrice,
      maxPrice,
      bedrooms,
      city,
      status,
      page = 1,
      limit = 12,
    } = req.query;

    const filter = {};

    if (q) {
      filter.$text = { $search: q };
    }
    if (listingType && listingType !== 'all') {
      filter.listingType = listingType;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (bedrooms) {
      filter.bedrooms = { $gte: Number(bedrooms) };
    }
    if (city) {
      filter.city = new RegExp(city, 'i');
    }
    if (status === 'all') {
      // no status filter — used by admin dashboard
    } else if (status) {
      filter.status = status;
    } else {
      filter.status = { $in: ['available', 'pending'] };
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [properties, total] = await Promise.all([
      Property.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Property.countDocuments(filter),
    ]);

    res.json({
      properties,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to fetch properties' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json({ property });
  } catch {
    res.status(404).json({ message: 'Property not found' });
  }
});

router.post('/', protect, adminOnly, propertyValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
  }

  try {
    const property = await Property.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json({ property });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to create property' });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json({ property });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update property' });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json({ message: 'Property deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to delete property' });
  }
});

module.exports = router;
