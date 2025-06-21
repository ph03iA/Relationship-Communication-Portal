# 💕 Relationship Communication Portal

A comprehensive MERN stack application designed to help couples communicate effectively, express their feelings, and work through relationship challenges together.

## 🌟 Features

### 🤝 Partner Communication
- **Partner Linking**: Connect with your partner using email addresses
- **Private Conversations**: Share feelings and concerns directly with your partner
- **Response System**: Partners can respond to each other's concerns
- **Communication Status**: Track if issues are pending response, responded, or resolved
- **Read Receipts**: Know when your partner has read your messages

### 💭 Community Support
- **Anonymous Sharing**: Share sensitive topics with the community anonymously
- **Advice & Perspectives**: Get support from others who understand relationship challenges
- **Categorized Issues**: Organize concerns by communication, attention, jealousy, etc.
- **Tagging System**: Use tags to find similar experiences and advice

### 📊 Relationship Tracking
- **Progress Monitoring**: Track communication improvements over time
- **Issue Resolution**: Mark concerns as resolved when addressed
- **Relationship Statistics**: View your relationship communication patterns
- **Growth Insights**: See how your relationship communication evolves

### 🔒 Privacy & Security
- **Secure Authentication**: JWT-based user authentication
- **Partner-Only Content**: Private conversations between linked partners
- **Anonymous Options**: Share with community without revealing identity
- **Data Protection**: Secure storage and transmission of sensitive information

## 🚀 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Framer Motion** - Animations
- **React Icons** - Icon library
- **React Hot Toast** - Notifications
- **date-fns** - Date formatting

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd relationship-communication-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/relationship-portal
   JWT_SECRET=your-secret-key-here
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

## 🎯 Usage Guide

### Getting Started

1. **Registration**
   - Create an account with your email and username
   - Choose your relationship status
   - Set up your profile preferences

2. **Partner Linking**
   - Navigate to Partner Chat section
   - Enter your partner's email address
   - Your partner will need to register and accept the link
   - Both accounts will be automatically connected

3. **Sharing Feelings**
   - Go to "Share Your Feelings" page
   - Write about your concerns or feelings
   - Choose appropriate category and importance level
   - Decide whether to share with partner only or community
   - Submit to start the conversation

### Partner Communication

1. **View Partner's Concerns**
   - Check the Partner Chat section for new messages
   - Read your partner's feelings and concerns
   - Understand their perspective

2. **Respond to Partner**
   - Click "Write Response" on partner's concerns
   - Express your thoughts and feelings
   - Provide understanding and solutions
   - Submit your response

3. **Track Communication**
   - Monitor communication status
   - Mark responses as read
   - Track resolved issues
   - View relationship progress

### Community Features

1. **Browse Community**
   - View shared experiences from other couples
   - Filter by category, importance, or status
   - Search for specific topics

2. **Provide Support**
   - Comment on community posts
   - Share your experiences and advice
   - Support others in similar situations

3. **Anonymous Sharing**
   - Share sensitive topics anonymously
   - Get community advice without revealing identity
   - Maintain privacy while seeking support

## 📱 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Partner Management
- `POST /api/users/link-partner` - Link with partner
- `POST /api/users/unlink-partner` - Unlink partner
- `GET /api/users/partner` - Get partner information

### Communication
- `GET /api/grievances` - Get all concerns (with filters)
- `GET /api/grievances/partner` - Get partner-specific concerns
- `POST /api/grievances` - Create new concern
- `GET /api/grievances/:id` - Get specific concern
- `PUT /api/grievances/:id` - Update concern
- `POST /api/grievances/:id/partner-response` - Respond to partner
- `PUT /api/grievances/:id/mark-read` - Mark response as read
- `POST /api/grievances/:id/comment` - Add comment
- `POST /api/grievances/:id/like` - Like/unlike concern

## 🎨 Features Overview

### Home Page
- Welcome message and platform introduction
- Feature highlights and benefits
- How it works guide
- Call-to-action for registration

### Partner Communication
- Partner linking interface
- Private conversation space
- Response system
- Communication status tracking

### Share Feelings
- Structured form for expressing concerns
- Category and importance selection
- Partner vs community sharing options
- Tips for effective communication

### Community Browse
- Filter and search functionality
- Categorized concerns
- Community comments and support
- Anonymous sharing options

### Profile Management
- User profile customization
- Relationship statistics
- Communication preferences
- Partner information

## 🔧 Development

### Project Structure
```
relationship-communication-portal/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       ├── pages/          # Page components
│       └── App.js          # Main app component
├── models/                 # MongoDB schemas
├── routes/                 # API routes
├── middleware/             # Custom middleware
├── server.js              # Express server
└── package.json           # Dependencies
```

### Available Scripts
- `npm run dev` - Start development server (backend + frontend)
- `npm start` - Start production server
- `npm run client` - Start React development server
- `npm run server` - Start Express server only

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with love for better relationship communication
- Inspired by the need for safe spaces to express feelings
- Designed to strengthen bonds through understanding and empathy

## 📞 Support

For support, email support@relationship-portal.com or create an issue in the repository.

---

**Made with 💕 for better relationships** 