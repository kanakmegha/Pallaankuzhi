# Pallanguzhi Game

A beautiful, interactive implementation of the traditional South Indian mancala game Pallanguzhi, built with React, TypeScript, and Canvas.

## 🎮 Live Demo

[Play Pallanguzhi Online](https://your-deployment-url.vercel.app)

## 🎯 About Pallanguzhi

Pallanguzhi is a traditional board game from South India, part of the mancala family of games. It's played on a board with 14 pits (7 per player) and 2 stores, where players strategically move shells to capture their opponent's pieces.

## ✨ Features

- **Interactive Canvas Board**: Beautiful hand-drawn game board with wood-grain texture
- **Smooth Animations**: Fluid shell movements and hover effects
- **Game State Persistence**: Your game progress is automatically saved
- **Comprehensive Tutorial**: Learn the rules with our step-by-step guide
- **Responsive Design**: Play on desktop, tablet, or mobile
- **Accessibility**: Full keyboard navigation and screen reader support
- **Cultural Design**: Authentic South Indian aesthetic with earthy tones

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pallanguzhi-game.git
cd pallanguzhi-game
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## 🎲 How to Play

### Game Setup
- Each pit starts with 5 shells
- Player 1 controls the bottom row, Player 2 controls the top row
- Each player has a store on their right side

### Gameplay
1. **Taking a Turn**: Click on any pit on your side that contains shells
2. **Sowing**: Pick up all shells and drop them one by one counterclockwise
3. **Capturing**: If your last shell lands in an empty pit on your side, capture that shell and all shells from the opposite pit
4. **Continue Turn**: If your last shell lands in your store, take another turn

### Winning
- The game ends when one player's side is completely empty
- The player with the most shells in their store wins!

## 🛠 Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Canvas**: HTML5 Canvas for game rendering
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📁 Project Structure

```
src/
├── components/
│   ├── GameBoard.tsx      # Canvas-based game board
│   ├── GameControls.tsx   # Game controls and status
│   └── Tutorial.tsx       # Help modal with game rules
├── hooks/
│   └── useGameState.ts    # Game state management
├── types/
│   └── game.ts           # TypeScript type definitions
├── utils/
│   └── gameLogic.ts      # Core game logic and rules
├── App.tsx               # Main application component
└── main.tsx             # Application entry point
```

## 🎨 Design Features

- **Cultural Authenticity**: Inspired by traditional South Indian aesthetics
- **Wood Texture**: Canvas-rendered wood grain background
- **Smooth Animations**: 60fps shell movements and transitions
- **Responsive Layout**: Adapts to all screen sizes
- **Accessibility**: ARIA labels and keyboard navigation

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📱 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎯 Future Enhancements

- [ ] AI opponent with difficulty levels
- [ ] Sound effects and background music
- [ ] Multiplayer online gameplay
- [ ] Tournament mode
- [ ] Game statistics and history
- [ ] Progressive Web App (PWA) support
- [ ] Multiple board themes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Traditional Pallanguzhi game rules and cultural heritage
- South Indian gaming traditions
- The mancala game family

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the tutorial in-game for gameplay help
- Review the game rules in the help section

---

**Enjoy playing Pallanguzhi!** 🎮✨