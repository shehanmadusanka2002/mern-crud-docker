# MERN Backend API

A professional RESTful API built with Node.js, Express, and MongoDB following MVC architecture and best practices.

## 📁 Project Structure

```
backend/
├── config/              # Configuration files
│   └── database.js      # MongoDB connection setup
├── controllers/         # Business logic (Controller layer)
│   └── user.controller.js
├── models/             # MongoDB schemas (Model layer)
│   └── user.model.js
├── routes/             # API routes (Route layer)
│   └── user.routes.js
├── middlewares/        # Custom middleware functions
│   ├── error.middleware.js
│   └── validate.middleware.js
├── utils/              # Helper functions
│   └── response.util.js
├── .env                # Environment variables
├── server.js           # Main entry point
└── package.json
```

## 🏗️ Architecture Pattern: MVC

**Model-View-Controller (MVC)** separates application into three interconnected components:

- **Model**: Data structure and database schema (`models/`)
- **View**: API responses (handled by `utils/response.util.js`)
- **Controller**: Business logic and request handling (`controllers/`)

## 🚀 Features

- ✅ **MVC Architecture** - Clean separation of concerns
- ✅ **RESTful API** - Standard HTTP methods (GET, POST, PUT, DELETE)
- ✅ **Data Validation** - Input validation and error handling
- ✅ **Pagination** - Efficient data fetching
- ✅ **Search Functionality** - Search users by name or email
- ✅ **Error Handling** - Centralized error management
- ✅ **Environment Variables** - Configuration management
- ✅ **CORS Support** - Cross-origin resource sharing
- ✅ **MongoDB Integration** - NoSQL database

## 📡 API Endpoints

### Base URL
```
http://localhost:5000
```

### Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/` | API health check | - |
| GET | `/api/users` | Get all users (with pagination & search) | - |
| GET | `/api/users/:id` | Get user by ID | - |
| POST | `/api/users` | Create new user | `{ name, email, phone?, age? }` |
| PUT | `/api/users/:id` | Update user | `{ name, email, phone?, age?, isActive? }` |
| DELETE | `/api/users/:id` | Delete user | - |
| GET | `/api/users/stats` | Get user statistics | - |

### Query Parameters (GET /api/users)

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search by name or email

**Example:**
```
GET /api/users?page=1&limit=5&search=john
```

## 📝 Request/Response Examples

### 1. Create User
**Request:**
```bash
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "age": 25
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "age": 25,
    "isActive": true,
    "createdAt": "2025-10-19T10:00:00.000Z",
    "updatedAt": "2025-10-19T10:00:00.000Z"
  }
}
```

### 2. Get All Users (with pagination)
**Request:**
```bash
GET /api/users?page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": {
    "users": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "age": 25,
        "isActive": true,
        "createdAt": "2025-10-19T10:00:00.000Z",
        "updatedAt": "2025-10-19T10:00:00.000Z"
      }
    ],
    "totalPages": 1,
    "currentPage": 1,
    "totalUsers": 1
  }
}
```

### 3. Get User Statistics
**Request:**
```bash
GET /api/users/stats
```

**Response:**
```json
{
  "success": true,
  "message": "User statistics fetched successfully",
  "data": {
    "totalUsers": 100,
    "activeUsers": 85,
    "inactiveUsers": 15
  }
}
```

### 4. Error Response
**Response:**
```json
{
  "success": false,
  "message": "User not found"
}
```

## 🔧 Installation & Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables

Create a `.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://mongo:27017/merncrud
CORS_ORIGIN=*
```

### 3. Run the Server

**Development (with auto-restart):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

## 🐳 Docker Setup

The backend is containerized and works with Docker Compose:

```bash
# Build and run with Docker Compose
docker-compose up --build

# Stop containers
docker-compose down
```

## 🔍 Code Explanation

### 1. **Models (Data Layer)**
Defines database schema and validation rules:
```javascript
// models/user.model.js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }
});
```

### 2. **Controllers (Business Logic)**
Handles request processing and database operations:
```javascript
// controllers/user.controller.js
const getAllUsers = async (req, res) => {
  const users = await User.find();
  return successResponse(res, users);
};
```

### 3. **Routes (API Endpoints)**
Maps URLs to controller functions:
```javascript
// routes/user.routes.js
router.get("/", getAllUsers);
router.post("/", createUser);
```

### 4. **Middlewares**
- **Validation**: Validates request data before processing
- **Error Handler**: Catches and formats errors consistently

### 5. **Utils**
Helper functions for consistent response formatting:
```javascript
successResponse(res, data, "Success message", 200);
errorResponse(res, "Error message", 400);
```

## 🧪 Testing API

### Using cURL:
```bash
# Get all users
curl http://localhost:5000/api/users

# Create user
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com"}'

# Get user by ID
curl http://localhost:5000/api/users/507f1f77bcf86cd799439011

# Update user
curl -X PUT http://localhost:5000/api/users/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"name":"John Updated"}'

# Delete user
curl -X DELETE http://localhost:5000/api/users/507f1f77bcf86cd799439011
```

### Using Postman:
Import the API endpoints and test each route with different request bodies.

## 🔐 Best Practices Implemented

1. ✅ **MVC Architecture** - Separation of concerns
2. ✅ **Error Handling** - Centralized error management
3. ✅ **Input Validation** - Data validation before processing
4. ✅ **Consistent Responses** - Standardized API responses
5. ✅ **Environment Variables** - Configuration management
6. ✅ **Async/Await** - Modern JavaScript async handling
7. ✅ **MongoDB Indexing** - Optimized database queries
8. ✅ **CORS Configuration** - Security headers
9. ✅ **Pagination** - Efficient data loading
10. ✅ **Search Functionality** - User-friendly data filtering

## 📚 Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **dotenv** - Environment variables
- **CORS** - Cross-origin resource sharing

## 🚨 Common Issues & Solutions

### Issue: MongoDB connection failed
**Solution:** Ensure MongoDB is running and connection string is correct in `.env`

### Issue: Port already in use
**Solution:** Change PORT in `.env` or kill the process using the port

### Issue: CORS errors
**Solution:** Configure `CORS_ORIGIN` in `.env` to match your frontend URL

## 📈 Future Enhancements

- [ ] Authentication & Authorization (JWT)
- [ ] Rate Limiting
- [ ] API Documentation (Swagger)
- [ ] Unit & Integration Tests
- [ ] Logging (Winston/Morgan)
- [ ] File Upload Support
- [ ] Email Notifications
- [ ] Caching (Redis)

## 📄 License

MIT License

## 👨‍💻 Author

Your Name - [GitHub Profile](https://github.com/shehanmadusanka2002)
