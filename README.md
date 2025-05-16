
# Social4Sports: Connect Through Sports

## 🏓 Project Overview

Social4Sports is a modern, interactive platform designed to connect sports enthusiasts, starting with ping pong players. Our application allows users to find nearby players, schedule matches, communicate in real-time, and track their progress—all in one seamless experience.

This project was developed as part of [University Name]'s [Course Name] by [Your Team Name].

![Social4Sports Screenshot](public/app-screenshot.png)

## 🚀 Key Features

- **User Authentication & Profile Management**
  - Personalized player profiles with skill levels, play styles, and availability
  - Comprehensive match history and performance statistics

- **Player Discovery**
  - Find players based on proximity, skill level, and availability
  - Smart filtering to match with compatible opponents

- **Real-time Messaging**
  - Direct communication with connected players
  - Schedule and coordinate matches easily

- **Match Management**
  - Create and track scheduled matches
  - Record match results and maintain history

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI Components**: Tailwind CSS, ShadCN UI
- **State Management**: React Context API, TanStack Query
- **Routing**: React Router
- **Backend**: Node.js API (separate repository)
- **Additional Tools**:
  - ESLint & Prettier for code quality
  - React Hook Form for form validation
  - Lucide React for iconography
  - Sonner for toast notifications

## 🏁 Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn package manager
- Backend API running at http://localhost:8000

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/social4sports.git

# Navigate to the project directory
cd social4sports

# Install dependencies
npm install
# or
yarn

# Start the development server
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:8080](http://localhost:8080).

### Connecting to Backend

Social4Sports is designed to work with a Node.js backend API running at `http://localhost:8000`. Make sure your backend server is running before using features that require API access.

## 📝 API Integration

The frontend communicates with the backend through a structured API service layer:

- Authentication (login, registration, profile management)
- Player discovery and connections
- Match scheduling and result tracking
- Messaging between players

## 📊 Project Structure

```
src/
├── components/         # UI components
│   ├── layout/         # Layout components
│   └── ui/             # Shadcn UI components
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
├── services/           # API services
└── ...
```

## 🔮 Future Enhancements

- Expansion to additional sports beyond ping pong
- Tournament organization features
- Enhanced player matching algorithm
- Mobile application development
- Community forums and group events

## 👥 Team

- [Your Name] - Frontend Developer
- [Team Member] - Backend Developer
- [Team Member] - UI/UX Designer
- [Team Member] - Project Manager

## 📄 License

[Specify your license here]

---

Developed with ❤️ by [Your Team Name]
