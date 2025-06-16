# LegalEase Backend

A FastAPI-based backend with SQLAlchemy ORM and Supabase integration, featuring robust authentication powered by FastAPI Users.

## Features

- 🔐 Complete Authentication System (FastAPI Users)
  - JWT-based Authentication
  - Email Verification
  - Password Reset
  - User Registration
- 👥 User Management
- 🏢 Company Management
- 🔑 Role-Based Access Control
- 🚀 FastAPI + SQLAlchemy + Supabase

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables in `.env`:
```env
# Database Configuration
user=postgres.ijcparkwogetqcknallb
password=[YOUR-PASSWORD]
host=aws-0-ap-southeast-1.pooler.supabase.com
port=5432
dbname=postgres

# Security
SECRET_KEY="your-secret-key-here"
```

3. Run the development server:
```bash
uvicorn main:app --reload
```

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Authentication (FastAPI Users)
- POST `/auth/jwt/login` - Login with email/password
- POST `/auth/jwt/logout` - Logout
- POST `/auth/register` - Register new user
- POST `/auth/request-verify-token` - Request email verification
- POST `/auth/verify` - Verify email
- POST `/auth/forgot-password` - Request password reset
- POST `/auth/reset-password` - Reset password

### Users
- GET `/users/me` - Get current user
- GET `/users/{id}` - Get user by ID
- PATCH `/users/{id}` - Update user
- DELETE `/users/{id}` - Delete user

### Companies
- POST `/api/v1/companies/` - Create company
- GET `/api/v1/companies/` - List companies
- GET `/api/v1/companies/{id}` - Get company details
- PATCH `/api/v1/companies/{id}` - Update company
- DELETE `/api/v1/companies/{id}` - Delete company (admin only)

## Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── auth/                   # Authentication module
│   ├── models.py          # User model
│   ├── schemas.py         # Pydantic schemas
│   ├── user_db.py         # User database adapter
│   └── fastapi_users_setup.py  # FastAPI Users configuration
├── api/                    # API routes
│   └── v1/                # API version 1
│       ├── users.py       # User routes
│       └── companies.py   # Company routes
├── core/                   # Core functionality
│   └── config.py          # Configuration settings
├── db/                     # Database setup
│   └── database.py        # SQLAlchemy configuration
├── models/                 # SQLAlchemy models
│   └── models.py          # Database models
├── schemas/                # Pydantic schemas
│   ├── user.py            # User schemas
│   └── company.py         # Company schemas
├── .env                    # Environment variables
└── requirements.txt        # Project dependencies
```

## Development

The project uses:
- **FastAPI Users** for authentication
- **SQLAlchemy** for database operations
- **Supabase** as the PostgreSQL database
- **JWT** for token-based authentication
- **Pydantic** for data validation

## Security Features

- 🔒 JWT-based authentication
- 🔐 Password hashing with bcrypt
- 📧 Email verification
- 🔄 Password reset functionality
- 👥 Role-based access control
- 🛡️ CORS protection
- 🔑 Environment variable configuration 