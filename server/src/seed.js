require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Property = require('./models/Property');
const Appointment = require('./models/Appointment');

const properties = [
  {
    title: 'Canyon View Residence',
    description:
      'A sculpted hillside home with floor-to-ceiling glass, warm oak floors, and a kitchen built for entertaining. Evening light pours across the living room and out to a quiet terrace overlooking the canyon.',
    price: 2480000,
    listingType: 'buy',
    bedrooms: 4,
    bathrooms: 3.5,
    area: 3200,
    address: '1847 Ridgecrest Drive',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90046',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
    ],
    features: ['Pool', 'Smart home', 'Wine cellar', '3-car garage', 'City views'],
    status: 'available',
    yearBuilt: 2019,
    parking: 3,
  },
  {
    title: 'Harbor Loft Apartment',
    description:
      'Open-plan loft living steps from the waterfront. Polished concrete, exposed beams, and a private balcony with marina views make this a rare rental in the district.',
    price: 4200,
    listingType: 'rent',
    bedrooms: 2,
    bathrooms: 2,
    area: 1450,
    address: '88 Pier Avenue, Unit 5B',
    city: 'San Diego',
    state: 'CA',
    zip: '92101',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80',
    ],
    features: ['Furnished', 'Doorman', 'Fitness center', 'Harbor views'],
    status: 'available',
    yearBuilt: 2015,
    parking: 1,
  },
  {
    title: 'Midtown Commerce Suite',
    description:
      'Turnkey commercial suite on a high-footfall corner. Glass storefront, flexible open floor, and private offices ready for retail, studio, or professional services.',
    price: 18500,
    listingType: 'commercial',
    bedrooms: 0,
    bathrooms: 2,
    area: 4200,
    address: '512 Market Street',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
    ],
    features: ['Street frontage', 'HVAC upgraded', 'Loading access', 'Fiber internet'],
    status: 'available',
    yearBuilt: 2012,
    parking: 8,
  },
  {
    title: 'Willow Creek Cottage',
    description:
      'A sunlit cottage tucked under mature oaks. Soft plaster walls, a stone fireplace, and a garden kitchen that opens to a brick patio — intimate, quiet, and move-in ready.',
    price: 875000,
    listingType: 'buy',
    bedrooms: 3,
    bathrooms: 2,
    area: 1850,
    address: '29 Willow Lane',
    city: 'Portland',
    state: 'OR',
    zip: '97214',
    images: [
      'https://images.unsplash.com/photo-1605276374104-dee2c0cb9c8a?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80',
    ],
    features: ['Garden', 'Fireplace', 'Updated kitchen', 'Detached studio'],
    status: 'available',
    yearBuilt: 1948,
    parking: 2,
  },
  {
    title: 'Skyline Penthouse',
    description:
      'Full-floor penthouse with wraparound terraces and an unobstructed skyline. Chef’s kitchen, spa bath, and a private elevator landing define this rare vertical estate.',
    price: 5200000,
    listingType: 'buy',
    bedrooms: 5,
    bathrooms: 4.5,
    area: 4800,
    address: '1 Aurora Tower, PH',
    city: 'Seattle',
    state: 'WA',
    zip: '98101',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
    ],
    features: ['Private elevator', 'Terrace', 'Concierge', 'Wine room', 'Home theater'],
    status: 'available',
    yearBuilt: 2021,
    parking: 3,
  },
  {
    title: 'Garden Flat on Maple',
    description:
      'Ground-floor rental with a private garden and calm interiors. Ideal for remote work — dedicated office nook, fast fiber, and a quiet residential street.',
    price: 2800,
    listingType: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    area: 820,
    address: '214 Maple Street, Apt 1',
    city: 'Chicago',
    state: 'IL',
    zip: '60614',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80',
    ],
    features: ['Private garden', 'In-unit laundry', 'Pet friendly'],
    status: 'available',
    yearBuilt: 2008,
    parking: 0,
  },
  {
    title: 'Lakeside Family Home',
    description:
      'Spacious family home on a quiet lake cul-de-sac. Open living spaces, a chef’s island kitchen, and a screened porch for summer evenings by the water.',
    price: 1295000,
    listingType: 'buy',
    bedrooms: 5,
    bathrooms: 3,
    area: 3600,
    address: '77 Lakeshore Court',
    city: 'Minneapolis',
    state: 'MN',
    zip: '55419',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdbc?w=1200&q=80',
      'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&q=80',
    ],
    features: ['Lake access', 'Screened porch', 'Finished basement', '2-car garage'],
    status: 'available',
    yearBuilt: 2005,
    parking: 2,
  },
  {
    title: 'Studio Warehouse Showroom',
    description:
      'Industrial commercial space with soaring ceilings and natural light — suited for gallery, design studio, or boutique showroom. Flexible lease terms available.',
    price: 9500,
    listingType: 'commercial',
    bedrooms: 0,
    bathrooms: 1,
    area: 2800,
    address: '390 Industrial Way',
    city: 'Denver',
    state: 'CO',
    zip: '80216',
    images: [
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80',
    ],
    features: ['High ceilings', 'Roll-up door', 'Open floor plan', 'Street parking'],
    status: 'available',
    yearBuilt: 1998,
    parking: 4,
  },
  {
    title: 'Palm Court Townhome',
    description:
      'Contemporary townhome with a rooftop deck and low-maintenance living. Three levels of clean lines, soft neutrals, and indoor-outdoor flow throughout.',
    price: 1100000,
    listingType: 'buy',
    bedrooms: 3,
    bathrooms: 2.5,
    area: 2100,
    address: '15 Palm Court',
    city: 'Miami',
    state: 'FL',
    zip: '33139',
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80',
      'https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=1200&q=80',
    ],
    features: ['Rooftop deck', 'Smart appliances', 'Community pool'],
    status: 'available',
    yearBuilt: 2018,
    parking: 2,
  },
  {
    title: 'North End Brownstone Floor',
    description:
      'Classic brownstone floor-through with tall windows and restored millwork. Walkable to parks, cafés, and transit — a refined rental in a historic neighborhood.',
    price: 5500,
    listingType: 'rent',
    bedrooms: 3,
    bathrooms: 2,
    area: 1680,
    address: '412 Beacon Street, Floor 2',
    city: 'Boston',
    state: 'MA',
    zip: '02116',
    images: [
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1200&q=80',
      'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=1200&q=80',
    ],
    features: ['Historic details', 'Tall ceilings', 'Washer/dryer', 'Near transit'],
    status: 'available',
    yearBuilt: 1890,
    parking: 0,
  },
  {
    title: 'Desert Modern Retreat',
    description:
      'Low-slung desert modern with rammed-earth walls and a shaded courtyard. Designed for quiet living under big skies, with seamless indoor-outdoor rooms.',
    price: 1675000,
    listingType: 'buy',
    bedrooms: 4,
    bathrooms: 3,
    area: 2900,
    address: '901 Saguaro Trail',
    city: 'Scottsdale',
    state: 'AZ',
    zip: '85255',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=1200&q=80',
    ],
    features: ['Courtyard', 'Pool', 'Solar', 'Mountain views'],
    status: 'available',
    yearBuilt: 2017,
    parking: 2,
  },
  {
    title: 'Riverfront Office Pod',
    description:
      'Boutique commercial pod with river views and private meeting rooms. Perfect for a consultancy or creative agency seeking a polished address.',
    price: 7200,
    listingType: 'commercial',
    bedrooms: 0,
    bathrooms: 2,
    area: 1600,
    address: '220 Riverwalk Plaza, Suite 300',
    city: 'Nashville',
    state: 'TN',
    zip: '37203',
    images: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&q=80',
    ],
    features: ['River views', 'Meeting rooms', 'Kitchenette', 'Secure entry'],
    status: 'available',
    yearBuilt: 2016,
    parking: 3,
  },
];

async function seed() {
  await connectDB();

  await Promise.all([
    Appointment.deleteMany({}),
    Property.deleteMany({}),
    User.deleteMany({}),
  ]);

  const admin = await User.create({
    name: 'Meridian Admin',
    email: 'admin@meridian.homes',
    password: 'admin123',
    role: 'admin',
    phone: '(555) 010-1000',
  });

  const demoUser = await User.create({
    name: 'Alex Rivera',
    email: 'alex@example.com',
    password: 'user123',
    role: 'user',
    phone: '(555) 010-2000',
  });

  const created = await Property.insertMany(
    properties.map((p) => ({ ...p, createdBy: admin._id }))
  );

  console.log(`Seeded ${created.length} properties`);
  console.log('Admin: admin@meridian.homes / admin123');
  console.log('User:  alex@example.com / user123');
  console.log(`Demo user id: ${demoUser._id}`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
