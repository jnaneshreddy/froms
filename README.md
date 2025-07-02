# Form Builder Application

A full-stack form builder application that allows administrators to create dynamic forms and users to fill them out. Built with React, Node.js, Express, MongoDB, and Tailwind CSS.

![Form Builder Demo](https://img.shields.io/badge/Status-Live-green) ![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue)

## 🚀 Live Deployment

- **Frontend**: [Deployed on Vercel](https://forms.jnaneshreddy.social/) *(Update with your actual Vercel URL)*
- **Backend**: [https://froms-5jow.onrender.com](https://froms-5jow.onrender.com)

## 📋 Features

### Admin Features
- 🔐 **Admin Authentication** - Secure login/logout system
- 📝 **Form Builder** - Drag-and-drop form creation with multiple field types
- ✏️ **Form Management** - Create, edit, and delete forms
- 👥 **User Management** - Add, view, and delete users
- 📊 **Response Analytics** - View all form submissions with user details
- 🔄 **Real-time Updates** - Live form editing and response tracking

### User Features
- 🔐 **User Authentication** - Secure user login/logout
- 📋 **Form Filling** - Interactive form completion interface
- ✅ **Submission Tracking** - View submitted vs. pending forms
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

### Form Field Types
- 📝 **Text Input** - Single line text fields
- 📄 **Textarea** - Multi-line text input
- 📧 **Email** - Email validation
- 🔢 **Number** - Numeric input
- 📞 **Phone** - Phone number input
- 📅 **Date** - Date picker
- 📋 **Select Dropdown** - Single choice selection
- 🔘 **Radio Buttons** - Single choice from options
- ☑️ **Checkboxes** - Multiple choice selection

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - Modern React with hooks
- **React Router 7.6.3** - Client-side routing
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **Lucide React** - Modern icon library
- **Shadcn/UI** - High-quality UI components

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### DevOps & Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Cloud database
- **Git** - Version control

## 📦 Project Structure

```
forms2/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   │   ├── Button.jsx
│   │   │   ├── FormBuilder.jsx
│   │   │   ├── FormField.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/           # Main page components
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   └── UserForms.jsx
│   │   ├── utils/           # Utility functions
│   │   │   ├── api.js       # API configuration
│   │   │   └── auth.js      # Authentication helpers
│   │   └── styles/          # Global styles
│   ├── package.json
│   ├── tailwind.config.js
│   └── vercel.json          # Vercel deployment config
└── server/                  # Node.js backend application
    ├── middleware/          # Express middleware
    │   └── auth.js         # JWT authentication middleware
    ├── models/             # Mongoose data models
    │   ├── User.js
    │   ├── Form.js
    │   └── Submission.js
    ├── routes/             # API route handlers
    │   ├── auth.js         # Authentication routes
    │   ├── forms.js        # Form CRUD operations
    │   └── submissions.js  # Form submission handling
    ├── package.json
    ├── server.js           # Express server setup
    └── seed.js            # Database seeding script
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/jnaneshreddy/froms.git
cd forms2
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure your `.env` file:**
```env
MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/form-builder?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
```

```bash
# Seed the database with sample data
node seed.js

# Start the development server
npm start
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Create environment file
echo "REACT_APP_API_URL=http://localhost:5000" > .env

# Start the development server
npm start
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

### 5. Test Login Credentials

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

**User Accounts:**
- Email: `john@example.com` | Password: `user123`
- Email: `jane@example.com` | Password: `user123`
- Email: `bob@example.com` | Password: `user123`
- Email: `alice@example.com` | Password: `user123`

## 📚 API Documentation

### Base URL
- **Development**: `http://localhost:5000`
- **Production**: `https://froms-5jow.onrender.com`

### Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### API Endpoints

#### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/login` | User login | Public |
| POST | `/api/auth/register` | User registration | Admin only |
| GET | `/api/auth/users` | Get all users | Admin only |
| PUT | `/api/auth/users/:id` | Update user | Admin only |
| DELETE | `/api/auth/users/:id` | Delete user | Admin only |
| POST | `/api/auth/logout` | User logout | Protected |

#### Form Routes (`/api/forms`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/forms` | Get all forms | Protected |
| GET | `/api/forms/:id` | Get form by ID | Protected |
| POST | `/api/forms` | Create new form | Admin only |
| PUT | `/api/forms/:id` | Update form | Admin only |
| DELETE | `/api/forms/:id` | Delete form | Admin only |

#### Submission Routes (`/api/submissions`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/submissions` | Submit form response | User only |
| GET | `/api/submissions/form/:formId` | Get form submissions | Admin only |
| GET | `/api/submissions/user/:userId` | Get user details | Admin only |

### Request/Response Examples

#### Login Request
```json
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

#### Login Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64a7b8c9d1f2e3a4b5c6d7e8",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

#### Create Form Request
```json
POST /api/forms
{
  "title": "Customer Feedback Survey",
  "description": "Help us improve our services",
  "fields": [
    {
      "id": "name",
      "label": "Full Name",
      "type": "text",
      "placeholder": "Enter your name"
    },
    {
      "id": "rating",
      "label": "Rating",
      "type": "select",
      "options": ["Excellent", "Good", "Average", "Poor"]
    }
  ]
}
```

#### Submit Form Response
```json
POST /api/submissions
{
  "formId": "64a7b8c9d1f2e3a4b5c6d7e8",
  "responses": {
    "name": "John Doe",
    "rating": "Excellent"
  }
}
```

## 🎨 Key Design Decisions

### Architecture Decisions

#### 1. **Microservices-like Separation**
- **Frontend**: Pure React SPA for better UX and faster interactions
- **Backend**: RESTful API for clean separation of concerns
- **Database**: MongoDB for flexible, document-based form storage

#### 2. **Authentication Strategy**
- **JWT Tokens**: Stateless authentication for scalability
- **Role-based Access**: Admin vs User permissions
- **Client-side Storage**: Tokens stored in localStorage for persistence

#### 3. **Form Data Structure**
```javascript
// Flexible field schema allows for dynamic form creation
{
  id: "unique-field-id",
  label: "Field Label",
  type: "text|email|select|textarea|radio|checkbox|number|date|tel",
  placeholder: "Optional placeholder",
  options: ["For select/radio/checkbox types"]
}
```

### Frontend Design Patterns

#### 1. **Component-based Architecture**
- **Reusable Components**: `FormField`, `Button`, `Navbar`
- **Page Components**: Separate concerns for different user flows
- **Higher-order Components**: `ProtectedRoute` for authentication

#### 2. **State Management**
- **React Hooks**: `useState`, `useEffect` for local state
- **Context-free**: No global state needed due to simple data flow
- **localStorage**: Persistent user authentication state

#### 3. **API Integration**
- **Centralized Configuration**: Single `api.js` file for all endpoints
- **Environment-based URLs**: Different endpoints for dev/prod
- **Helper Functions**: Standardized auth headers and error handling

### Backend Design Patterns

#### 1. **MVC Architecture**
- **Models**: Mongoose schemas for data validation
- **Controllers**: Route handlers for business logic
- **Routes**: Express routers for endpoint organization

#### 2. **Middleware Pattern**
- **Authentication Middleware**: JWT verification
- **CORS Middleware**: Cross-origin request handling
- **Error Handling**: Consistent error responses

#### 3. **Database Design**
```javascript
// User Schema
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "admin" | "user"
}

// Form Schema
{
  title: String,
  description: String,
  fields: [FieldSchema],
  createdBy: ObjectId (User reference)
}

// Submission Schema
{
  formId: ObjectId (Form reference),
  userId: ObjectId (User reference),
  responses: Mixed (flexible key-value pairs),
  submittedAt: Date
}
```

### Security Considerations

#### 1. **Authentication Security**
- Password hashing with bcryptjs (10 salt rounds)
- JWT tokens with expiration
- Role-based route protection

#### 2. **Input Validation**
- Mongoose schema validation
- Client-side form validation
- SQL injection prevention (NoSQL)

#### 3. **CORS Configuration**
- Specific origin allowlists
- Credential support for authenticated requests
- Production vs development origins

### Performance Optimizations

#### 1. **Frontend Optimizations**
- React.memo for expensive components
- Lazy loading for code splitting
- Tailwind CSS for minimal bundle size

#### 2. **Backend Optimizations**
- MongoDB indexing on frequently queried fields
- JWT stateless authentication (no session storage)
- Express.js middleware caching

#### 3. **Deployment Optimizations**
- Vercel edge deployment for frontend
- Render auto-scaling for backend
- MongoDB Atlas geographically distributed clusters

## 🔧 Development Workflow

### Local Development
```bash
# Start backend (Terminal 1)
cd server && npm start

# Start frontend (Terminal 2)
cd frontend && npm start
```

### Building for Production
```bash
# Build frontend
cd frontend && npm run build

# Test production build locally
npx serve -s build
```

### Database Management
```bash
# Seed database with sample data
cd server && node seed.js

# Connect to MongoDB Atlas
# Use the connection string in your .env file
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set root directory to `frontend`
3. Configure environment variables:
   - `REACT_APP_API_URL=https://froms-5jow.onrender.com`
4. Deploy automatically on push to main branch

### Backend (Render)
1. Connect GitHub repository to Render
2. Set root directory to `server`
3. Configure environment variables in Render dashboard
4. Deploy automatically on push to main branch

## 📈 Future Enhancements

### Planned Features
- [ ] **Form Templates**: Pre-built form templates for common use cases
- [ ] **Advanced Field Types**: File upload, rich text editor, rating scales
- [ ] **Form Analytics**: Response statistics and data visualization
- [ ] **Email Notifications**: Automated emails on form submission
- [ ] **Form Sharing**: Public form links for non-registered users
- [ ] **Form Versioning**: Track form changes over time
- [ ] **Bulk Operations**: Import/export forms and responses
- [ ] **Advanced Permissions**: Fine-grained user permissions

### Technical Improvements
- [ ] **Real-time Updates**: WebSocket integration for live form editing
- [ ] **Caching**: Redis caching for improved performance
- [ ] **Testing**: Comprehensive unit and integration tests
- [ ] **Documentation**: OpenAPI/Swagger documentation
- [ ] **Monitoring**: Application performance monitoring
- [ ] **CI/CD**: Automated testing and deployment pipelines

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Jnanesh Reddy** - *Initial work* - [@jnaneshreddy](https://github.com/jnaneshreddy)

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Express.js](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Vercel](https://vercel.com/) - Frontend hosting
- [Render](https://render.com/) - Backend hosting

---


