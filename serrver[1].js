const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON payload

// In-Memory Database Store
let users = [
  { id: 1, name: 'Alex Johnson', email: 'alex@decodelabs.tech', role: 'Full Stack Intern' },
  { id: 2, name: 'Sam Smith', email: 'sam@decodelabs.tech', role: 'Backend Intern' }
];

// --- API ENDPOINTS ---

/**
 * 1. Root Route
 * GET /
 */
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to DecodeLabs Backend API - Project 2 Engine',
    status: 'Running'
  });
});

/**
 * 2. Get All Users
 * GET /api/users
 */
app.get('/api/users', (req, res) => {
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

/**
 * 3. Get Single User By ID
 * GET /api/users/:id
 */
app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: `User with ID ${userId} not found.`
    });
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * 4. Add New User (With Input Data Validation)
 * POST /api/users
 */
app.post('/api/users', (req, res) => {
  const { name, email, role } = req.body;

  // --- DATA VALIDATION ---
  if (!name || !email || !role) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Please provide name, email, and role.'
    });
  }

  // Basic Email Format Check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Invalid email format.'
    });
  }

  // Check for Duplicate Email
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Validation Error: Email already exists.'
    });
  }

  // Create New Record
  const newUser = {
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
    name,
    email,
    role
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: 'User created successfully!',
    data: newUser
  });
});

/**
 * 5. Catch-All Route for Undefined Endpoints (404 Handling)
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found. Check your HTTP method or URL path.'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});