# Newalfox Interactive TriDfolio - Next.js & Three.js

![Portfolio Banner](https://via.placeholder.com/1200x300)

An immersive 3D portfolio experience built with Next.js, Three.js, React Three Rapier, and React Three Fiber.
This project showcases interactive 3D elements, physics-based interactions, and a modern UI design.

## ✨ Features

- **Interactive 3D Environment**

  - Character controller with physics
  - Dynamic platforms and obstacles
  - Responsive 3D objects and animations
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
├── public/
│   ├── assets/
│   │   ├── 3d/
│   │   │   ├── blend/
│   │   │   │   ├── Fox/
│   │   │   │   │   └── Old/
│   │   │   │   └── RestaurantSign/
│   │   │   ├── fbx/
│   │   │   └── glb/
│   │   ├── images/
│   │   │   ├── example/
│   │   │   └── inventory/
│   │   └── videos/
│   └── fonts/
├── src/
│   ├── app/
│   │   ├── playground/
│   │   │   ├── core/
│   │   │   │   ├── character/
│   │   │   │   │   └── vehicles/
│   │   │   │   ├── class/
│   │   │   │   │   ├── entities/
│   │   │   │   │   │   ├── mesh/
│   │   │   │   │   │   └── platform/
│   │   │   │   │   ├── environment/
│   │   │   │   │   ├── rendering/
│   │   │   │   │   ├── template/
│   │   │   │   │   └── ui/
│   │   │   │   ├── client/
│   │   │   │   │   └── inventory/
│   │   │   │   │       └── edit-tool/
│   │   │   │   └── extension/
│   │   │   │       └── arche/
│   │   │   │           ├── hooks/
│   │   │   │           ├── store/
│   │   │   │           ├── types/
│   │   │   │           └── utils/
│   │   │   └── world/
│   │   │       └── demo/
│   ├── components/
│   ├── constants/
│   └── hooks/
│       └── leva/
└──
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
