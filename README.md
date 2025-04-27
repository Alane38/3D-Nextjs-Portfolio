# Newalfox Interactive TriDfolio - Next.js & Three.js

![Portfolio Banner](https://via.placeholder.com/1200x300)

An immersive 3D portfolio experience built with Next.js, Three.js, React Three Rapier, and React Three Fiber.
This project showcases interactive 3D elements, physics-based interactions, and a modern UI design.

## ✨ Features
- **Interactive 3D Environment**

  - Character controller with physics(ARCHE)
  - Dynamic platforms and obstacles
  - Responsive 3D objects and animations
  - Custom entity manager for 3D objects
  - Physics-based interactions using Rapier

- **Modern UI Components**

  - Parallax slider
  - Interactive timeline
  - Dynamic statistics with Chart.js (not work atm)
  - Responsive sidebar navigation
  - Project showcase sections

- **Technical Highlights**
  - Component-based architecture
  - Entity system for 3D objects
  - Physics engine integration
  - Modular and reusable components
  - TypeScript for type safety

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn or bun package manager

### Installation

1. Clone the repository

```bash
git clone https://github.com/Alane38/3d-nextjs-portfolio.git
cd 3d-nextjs-portfolio
```

2. Install dependencies

```bash
npm install
# or
yarn install
# or
bun install
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Project Structure

```
3D-Nextjs-Portfolio/                 
├── public/                         # Static public assets
│   ├── assets/                     # Project assets
│   │   ├── 3d/                     # 3D model files
│   │   │   ├── blend/              # Blender source files (.blend)
│   │   │   │   ├── Fox/            # Fox model files
│   │   │   │   │   └── Old/        # Older version of the Fox model
│   │   │   │   └── RestaurantSign/ # Restaurant sign model in .blend format
│   │   │   ├── fbx/                # 3D models in FBX format
│   │   │   └── glb/                # 3D models in GLB format
│   │   ├── images/                 # Image assets
│   │   │   ├── example/            # Example images
│   │   │   └── inventory/          # Inventory-related images
│   │   └── videos/                 # Video assets
│   └── fonts/                      # Custom fonts
├── src/                            # Source code
│   ├── app/                        # Application routes and pages
│   │   ├── playground/             # Experimental or demo playground
│   │   │   ├── core/               # Core game logic
│   │   │   │   ├── character/      # Character logic
│   │   │   │   │   └── vehicles/   # Vehicles used by characters
│   │   │   │   ├── class/          # Core classes and blueprints
│   │   │   │   │   ├── entities/   # Game entities
│   │   │   │   │   │   ├── mesh/   # Mesh-based entity components
│   │   │   │   │   │   └── platform/ # Platform-specific logic
│   │   │   │   │   ├── environment/ # Environment-related classes
│   │   │   │   │   ├── rendering/  # Rendering logic and utilities
│   │   │   │   │   ├── template/   # Class templates or patterns
│   │   │   │   │   └── ui/         # UI elements in class-based structure
│   │   │   │   ├── client/         # Client-side specific logic
│   │   │   │   │   └── inventory/  # Inventory system
│   │   │   │   │       └── edit-tool/ # Tools to edit inventory items
│   │   │   │   └── extension/      # Core extensions and plugins
│   │   │   │       └── arche/      # Arche framework-related modules
│   │   │   │           ├── hooks/  # Custom hooks for arche
│   │   │   │           ├── store/  # Global/local state stores
│   │   │   │           ├── types/  # Type definitions
│   │   │   │           └── utils/  # Utility functions
│   │   │   └── world/              # World logic and structure
│   │   │       └── demo/           # World demo scenes
│   ├── components/                 # Reusable React components
│   ├── constants/                  # Constant values and config
│   └── hooks/                      # Custom React hooks
│       └── leva/                   # Hooks for Leva UI controls

```

## 🛠️ Built With

- [Next.js](https://nextjs.org/) - React framework
- [Three.js](https://threejs.org/) - 3D graphics library
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - Three.js React renderer
- [React Three Rapier](https://github.com/pmndrs/react-three-rapier) - Physics engine
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## 🎮 Controls

- **ZQSD**  - Move Character
- **Mouse** - Move Character
- **Shift** - Run
- **Space** - Jump OR Brake
- **TAB**   - Lock Camera to Character
- **R**     - Reset Character(Unavailable)
- **Click** - Interact with objects

## 🔧 Configuration

The project uses various configuration files:

- `tsconfig.json` - TypeScript configuration
- `package.json` - Project dependencies and scripts

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Three.js community
- React Three Rapier team
- React Three Fiber team
- Next.js team
- All contributors and supporters

## 🌟 THANKS TO 

- Isaac Mason: [https://github.com/isaac-mason](https://github.com/isaac-mason)
- Poimandres: [https://github.com/pmndrs](https://github.com/pmndrs)
- Erdong Chen: [https://github.com/ErdongChen-Andrew](https://github.com/ErdongChen-Andrew)

## 📧 Contact

Project Link: [https://github.com/Alane38/3d-nextjs-portfolio](https://github.com/Alane38/3d-nextjs-portfolio)
