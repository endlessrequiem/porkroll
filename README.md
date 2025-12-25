# PorkRoll 🐷

A 3D version of the Pig Mania board game built with Three.js and Vite. Roll the pig dice in a boxing ring and be the first to reach 100 points!

## 🎮 How to Play

- **Roll Pigs**: Click "Roll Pigs" to toss the two pig dice
- **Stop & Bank**: End your turn and add your points to your total score
- **First to 100**: The first player to reach 100 points wins!

### Scoring

- **Trotter** (on all four legs): 5 points
- **Razorback** (on its back): 5 points
- **Snouter** (on snout and two feet): 10 points
- **Leaning Jowler** (on snout, one ear, and one leg): 15 points
- **Doubles**: Bonus points (20-60 points)
- **Pig Out**: Turn ends with 0 points
- **Cider**: 1 point

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 GitHub Pages Deployment

### Option 1: Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Push the `dist` folder to the `gh-pages` branch:
   ```bash
   git subtree push --prefix dist origin gh-pages
   ```
   
   Or use the `gh-pages` package:
   ```bash
   npm install --save-dev gh-pages
   npm run deploy
   ```

3. In your GitHub repository settings, go to Pages and set the source to the `gh-pages` branch.

### Option 2: Automatic Deployment (Recommended)

The included GitHub Actions workflow will automatically build and deploy to GitHub Pages on every push to the `main` branch.

1. Make sure your repository name matches the base path in `vite.config.js` (currently set to `/porkroll/`)
2. Push to the `main` branch
3. The workflow will automatically deploy to GitHub Pages

## ⚙️ Configuration

If your repository name is different from `porkroll`, update the `REPO_NAME` constant in `vite.config.js`:

```js
const REPO_NAME = 'your-repo-name'; // Change this to match your GitHub repo name
```

This ensures the base path is correct for GitHub Pages deployment.

## 🛠️ Tech Stack

- **Three.js** - 3D graphics and rendering
- **Vite** - Build tool and dev server
- **Vanilla JavaScript** - Game logic

## 📝 License

MIT
