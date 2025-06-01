# Social4Sports: Connect Through Sports  

🏓 Modern platform connecting ping pong players to find matches, track progress, and chat in real-time.  

![App Screenshot](public/main.png)  

## 🚀 Quick Start  

### Prerequisites  
- Node.js (v16+)  
- Running backend API (default: `http://localhost:8000`)  

### Installation  
```bash
git clone https://github.com/yourusername/social4sports.git  
cd social4sports  
npm install
```

Environment Setup
Create .env file in root directory:

env
```VITE_API_URL=http://localhost:8000  
VITE_API_SOCKET_PATH=http://localhost:3000
```
Run Development Server

```bash
npm run dev  
Access at: http://localhost:8080
```

## ✨ Key Features

### 🔐 Authentication  
- Secure JWT login system  
<img src="public/auth.png" width="400" alt="Authentication Screen">

---

### 📊 Player Profiles  
- Detailed stats and match history  
<img src="public/profile.png" width="400" alt="Profile Screen">

---

### 🔍 Player Discovery  
📍 Find nearby players by skill level/availability  
<img src="public/find-players.png" width="400" alt="Player Discovery Screen">

---

### 💬 Real-Time Messaging  
- Instant chat with opponents  
- Schedule matches directly  
<img src="public/real-time-chat.png" width="400" alt="Chat Screen">

---

### 🔔 Notification System  
- Get alerts for new messages and match updates  
<img src="public/notifications.png" width="400" alt="Notifications Screen">

---

### 🏓 Match Management  
📅 Schedule games & track history  
📊 Performance analytics dashboard  

<div style="display: flex; gap: 20px; margin-top: 15px;">
  <img src="public/matches.png" width="350" alt="Matches Screen">
  <img src="public/schedule-match.png" width="350" alt="Schedule Screen">
</div>

🛠️ Technology Stack
Area	Technologies
- Frontend	React, TypeScript, Vite
- Styling	Tailwind CSS, ShadCN UI
- State	Context API, Zustand, axios
- Backend	Node.js API (separate repo)

### 🌟 Future Roadmap
- 🎾 Multi-sport expansion

- 🏆 Tournament mode

- 📱 Mobile app development

- 🤖 Smart matchmaking algorithm

### 👥 Team
Aziz Najjar - Laouissi Sadok - Ali Husnain - Daemi Mahsa



Developed with ❤️ by Social4Sports Team @ ELTE
