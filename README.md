# Meridian — Premium Real Estate

Full-stack real estate platform with a React frontend, Node/Express API, MongoDB, and JWT auth.

## Features

- Premium homepage with featured listings
- Property search with Buy / Rent / Commercial filters
- Price and bedroom filtering
- Property cards and detail pages
- Schedule-a-visit form (authenticated users)
- User registration and login (JWT)
- Admin dashboard: add, edit, delete properties; view/manage appointments
- Responsive layout for desktop and mobile

## Stack

- **Frontend:** React + Vite + TypeScript
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT (Bearer tokens)

## Prerequisites

- Node.js 20+
- MongoDB running locally (default `mongodb://127.0.0.1:27017/meridian`)

## Setup

```bash
# Install dependencies
npm run install:all

# Start MongoDB (example)
mongod --dbpath /data/db --bind_ip 127.0.0.1 --port 27017

# Seed sample data
npm run seed

# Run API + frontend
npm run dev
```

- Frontend: [http://127.0.0.1:4820](http://127.0.0.1:4820)
- API: [http://127.0.0.1:4821](http://127.0.0.1:4821)

Configure the API via `server/.env` (`PORT`, `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`).

## Demo accounts

| Role  | Email                 | Password  |
|-------|-----------------------|-----------|
| Admin | admin@meridian.homes  | admin123  |
| User  | alex@example.com      | user123   |

## API overview

| Method | Path | Notes |
|--------|------|-------|
| POST | `/api/auth/register` | Create user |
| POST | `/api/auth/login` | Get JWT |
| GET | `/api/auth/me` | Current user |
| GET | `/api/properties` | List/search (`q`, `listingType`, `minPrice`, `maxPrice`, `bedrooms`, `city`) |
| GET | `/api/properties/:id` | Detail |
| POST/PUT/DELETE | `/api/properties` | Admin CRUD |
| POST | `/api/appointments` | Schedule visit (auth) |
| GET | `/api/appointments` | Admin list |
| PATCH | `/api/appointments/:id/status` | Admin status update |

## Project structure

```
client/   React app (port 4820)
server/   Express API (port 4821)
```
