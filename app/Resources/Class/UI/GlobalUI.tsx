import { Html } from "@react-three/drei";
import { Chart } from "chart.js";
import { useScroll, useTransform } from "framer-motion";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

type Button = {
  label: string;
  href: string;
  class: string;
};

type Content = {
  containerClass: string;
  titleClass: string;
  subtitleClass: string;
  paragraphClass: string;
  paragraph: string;
};

class HtmlSection {
  title: string;
  description: string;
  buttons: Button[];
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  content: Content;

  constructor(
    title: string,
    description: string,
    buttons: Button[],
    position: [number, number, number],
    rotation: [number, number, number],
    scale: number,
    content: Content,
  ) {
    this.title = title;
    this.description = description;
    this.buttons = buttons;
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
    this.content = content;
  }

  render() {
    return (
      <div className={this.content.containerClass}>
        <h1 className={this.content.titleClass}>{this.title}</h1>
        <h3 className={this.content.subtitleClass}>{this.description}</h3>
        <p className={this.content.paragraphClass}>{this.content.paragraph}</p>
        <div className="flex space-x-4">
          {this.buttons.map((button, index) => (
            <button
              key={index}
              onClick={() => (window.location.href = button.href)}
              className={button.class}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>
    );
  }
}

export const ParallaxSlider: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sliderRef,
    offset: ["start start", "end start"],
  });

  const translateX = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  useEffect(() => {
    if (sliderRef.current) {
      console.log("Parallax Slider Initialisé");
    }
  }, []);

  return (
    <div ref={sliderRef} className="relative h-64 w-full overflow-hidden">
      <motion.div
        style={{ x: translateX }}
        className="flex h-full w-[200%] items-center space-x-10"
      >
        {/* Slides du slider */}
        <div className="flex h-full w-1/4 items-center justify-center bg-blue-500 text-lg font-bold text-white">
          Slide 1
        </div>
        <div className="flex h-full w-1/4 items-center justify-center bg-green-500 text-lg font-bold text-white">
          Slide 2
        </div>
        <div className="flex h-full w-1/4 items-center justify-center bg-red-500 text-lg font-bold text-white">
          Slide 3
        </div>
        <div className="flex h-full w-1/4 items-center justify-center bg-purple-500 text-lg font-bold text-white">
          Slide 4
        </div>
      </motion.div>
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full bg-black/80 p-6 text-white ${open ? "translate-x-0" : "-translate-x-full"} transition-all duration-300 ease-in-out`}
      >
        <h2 className="text-2xl font-semibold text-cyan-400">Menu</h2>
        <ul className="mt-6 space-y-4">
          <li>
            <a href="#projets" className="text-lg text-cyan-300">
              Projets
            </a>
          </li>
          <li>
            <a href="#contact" className="text-lg text-cyan-300">
              Contact
            </a>
          </li>
          <li>
            <a href="#about" className="text-lg text-cyan-300">
              À propos
            </a>
          </li>
        </ul>
        <button
          onClick={toggleSidebar}
          className="absolute top-6 right-6 text-2xl"
        >
          &times;
        </button>
      </div>
      <button
        onClick={toggleSidebar}
        className="fixed top-6 left-6 text-2xl text-cyan-400"
      >
        ☰
      </button>
    </>
  );
};

export const BarChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May"],
          datasets: [
            {
              label: "Projets réalisés",
              data: [65, 59, 80, 81, 56],
              backgroundColor: "rgba(0, 255, 255, 0.6)",
              borderColor: "rgba(0, 255, 255, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
      console.log("Bar Chart Initialised");
    }
  }, []);

  return (
    <div className="rounded-2xl bg-black/50 p-6 text-white shadow-2xl backdrop-blur-2xl">
      <h2 className="animate-fade-in mb-6 text-3xl font-bold text-cyan-400">
        Statistiques de Projets
      </h2>
      <canvas ref={chartRef} className="h-60 w-full" />
    </div>
  );
};

export const TimelineProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Démarrer la progression au montage du composant
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 100) {
          return prevProgress + 1;
        } else {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          return 100;
        }
      });
    }, 50); // Intervalle pour incrémenter la progression

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="relative rounded-2xl bg-black/50 p-6 text-white shadow-2xl backdrop-blur-2xl">
      <h2 className="animate-fade-in mb-6 text-3xl font-bold text-cyan-400">
        Timeline
      </h2>
      <div className="h-2 w-full rounded-full bg-gray-800">
        <div
          className="h-full rounded-full bg-cyan-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="mt-2 text-cyan-300">{progress}% de mon plan complété</p>
    </div>
  );
};

//   const TriDfolio: React.FC = () => {
//     const section1 = new HtmlSection(
//       'Bienvenue sur mon TriDfolio !',
//       'Qui a dit que les portfolios interactifs ne pouvaient pas être en 3D ?',
//       [
//         {
//           label: 'Explorez',
//           href: '/projects',
//           class: 'transform rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:from-blue-600 hover:to-cyan-500'
//         },
//         {
//           label: 'Contactez-moi',
//           href: '/contact',
//           class: 'transform rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-700'
//         }
//       ],
//       [0, 3, 0], // position
//       [-Math.PI / 2, 0, Math.PI], // rotation
//       0.003, // scale
//       {
//         containerClass: "rounded-2xl bg-black/50 p-10 text-white shadow-2xl backdrop-blur-2xl select-none",
//         titleClass: "animate-fade-in mb-6 text-5xl font-extrabold tracking-wide text-cyan-400 drop-shadow-lg",
//         subtitleClass: "animate-slide-in mb-4 text-sm font-medium tracking-wide text-cyan-300 opacity-80 drop-shadow-md",
//         paragraphClass: "animate-fade-in mb-6 text-lg text-cyan-200 opacity-90 delay-200",
//         paragraph: "Explorez mon univers futuriste et découvrez mes projets immersifs."
//       }
//     );

//     return (
//       <>
//         <ParallaxSlider />
//         <Sidebar />
//         <BarChart />
//         <TimelineProgress />
//         {section1.render()}
//       </>
//     );
//   };

//   export default TriDfolio;

interface HtmlContainerProps {
  children: React.ReactNode;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

export const HtmlContainer: React.FC<HtmlContainerProps> = ({
  children,
  position,
  rotation,
  scale,
}) => (
  <group rotation={rotation} position={position} scale={scale}>
    <mesh>
      <Html
        scale={0.3}
        rotation={[-Math.PI, 0, Math.PI]}
        position={[0, 0, 0]}
        transform
        occlude
      >
        {children}
      </Html>
    </mesh>
    <mesh castShadow receiveShadow />
  </group>
);

export const SectionWelcome: React.FC = () => (
  <div className="rounded-2xl bg-black/50 p-10 text-white shadow-2xl backdrop-blur-2xl select-none">
    <h1 className="animate-fade-in mb-6 text-5xl font-extrabold tracking-wide text-cyan-400 drop-shadow-lg">
      Bienvenue sur mon TriDfolio !
    </h1>
    <h3 className="animate-slide-in mb-4 text-sm font-medium tracking-wide text-cyan-300 opacity-80 drop-shadow-md">
      Qui a dit que les portfolios interactifs ne pouvaient pas être en 3D ?
    </h3>
    <p className="animate-fade-in mb-6 text-lg text-cyan-200 opacity-90 delay-200">
      Explorez mon univers futuriste et découvrez mes projets immersifs.
    </p>
    <div className="flex space-x-4">
      <button
        onClick={() => (window.location.href = "/projects")}
        className="transform rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:from-blue-600 hover:to-cyan-500"
      >
        Explorez
      </button>
      <button
        onClick={() => (window.location.href = "/contact")}
        className="transform rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-700"
      >
        Contactez-moi
      </button>
    </div>
  </div>
);

export const SectionInstallation: React.FC = () => (
  <div className="rounded-xl bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 p-8 text-white shadow-2xl backdrop-blur-2xl select-none">
    <h1 className="animate-fade-in mb-6 text-4xl font-bold text-white drop-shadow-xl">
      Installation interactive : "Lumières du futur"
    </h1>
    <p className="animate-fade-in text-md mb-6 opacity-90">
      Une expérience immersive où l’art rencontre la technologie. Explorez une
      installation lumineuse interactive.
    </p>
    <div className="mt-4 flex justify-between">
      <button
        onClick={() => (window.location.href = "/projects/light-future")}
        className="transform rounded-lg bg-yellow-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-105"
      >
        Explorer
      </button>
      <button
        onClick={() => (window.location.href = "/contact")}
        className="transform rounded-lg bg-gray-800 px-6 py-3 font-semibold text-white shadow-md transition-all duration-300 ease-in-out hover:scale-105"
      >
        Contactez-moi
      </button>
    </div>
  </div>
);

export const SectionProjects: React.FC = () => (
  <div className="overflow-hidden rounded-2xl bg-black/50 p-6 text-white shadow-2xl backdrop-blur-2xl">
    <h2 className="animate-fade-in mb-4 text-3xl font-bold text-cyan-400">
      Mes Projets
    </h2>
    <table className="min-w-full">
      <thead>
        <tr>
          <th className="p-3 text-left">Nom du Projet</th>
          <th className="p-3 text-left">Date de création</th>
          <th className="p-3 text-left">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="p-3">Portfolio Interactif</td>
          <td className="p-3">Mars 2025</td>
          <td className="p-3">
            Un portfolio en 3D avec des projets immersifs.
          </td>
        </tr>
        <tr>
          <td className="p-3">Lumières Interactives</td>
          <td className="p-3">Janvier 2024</td>
          <td className="p-3">
            Installation d'art numérique avec des effets lumineux interactifs.
          </td>
        </tr>
        <tr>
          <td className="p-3">Art Numérique</td>
          <td className="p-3">Décembre 2023</td>
          <td className="p-3">Une collection d'œuvres générées par IA.</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export const SectionChooseProject: React.FC = () => (
  <div className="rounded-2xl bg-black/50 p-6 text-white shadow-2xl backdrop-blur-2xl">
    <h2 className="animate-fade-in mb-4 text-3xl font-semibold text-cyan-400">
      Choisissez un Projet
    </h2>
    <div className="space-y-4">
      <div className="flex items-center">
        <input
          type="radio"
          id="project1"
          name="project"
          value="project1"
          className="mr-2"
        />
        <label htmlFor="project1" className="text-lg text-cyan-300">
          Portfolio Interactif
        </label>
      </div>
      <div className="flex items-center">
        <input
          type="radio"
          id="project2"
          name="project"
          value="project2"
          className="mr-2"
        />
        <label htmlFor="project2" className="text-lg text-cyan-300">
          Lumières Interactives
        </label>
      </div>
      <div className="flex items-center">
        <input
          type="radio"
          id="project3"
          name="project"
          value="project3"
          className="mr-2"
        />
        <label htmlFor="project3" className="text-lg text-cyan-300">
          Art Numérique
        </label>
      </div>
    </div>
  </div>
);

export const SectionContact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique d'envoi du formulaire ou d'appel API
    console.log("Form Data:", formData);
    // Réinitialiser les champs
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="rounded-2xl bg-black/50 p-6 text-white shadow-2xl backdrop-blur-2xl">
      <h2 className="animate-fade-in mb-6 text-3xl font-bold text-cyan-400">
        Contactez-moi
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-lg text-cyan-300">
            Votre nom
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Entrez votre nom"
            className="w-full rounded-lg p-3 text-black"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-lg text-cyan-300">
            Votre e-mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Entrez votre e-mail"
            className="w-full rounded-lg p-3 text-black"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-lg text-cyan-300">
            Votre message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Écrivez votre message"
            className="w-full rounded-lg p-3 text-black"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-cyan-600 py-3 font-semibold text-white shadow-lg transition-all duration-300 ease-in-out hover:bg-cyan-500"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
};

export const GlobalUI: React.FC = () => {
  return (
    <group>
      {/* Ajoutez ici les autres composants en tant que groupes */}

      {/* Intégration de TimelineProgress */}
      <HtmlContainer position={[-4.5, 3, 0]}>
        <TimelineProgress />
      </HtmlContainer>

      {/* Parallax Slider */}
      <HtmlContainer position={[-9.5, 3, 0]}>
        <ParallaxSlider />
      </HtmlContainer>

      {/* Sidebar */}
      <HtmlContainer position={[-7, 4, 0]}>
        <Sidebar />
      </HtmlContainer>

      {/* Bar Chart */}
      {/* <HtmlContainer position={[-1, 3, 0]}>
        <BarChart />
      </HtmlContainer> */}

      {/* Section Welcome (référence centrale) */}
      <HtmlContainer position={[0, 3, 0]}>
        <SectionWelcome />
      </HtmlContainer>

      {/* Section Choose Project */}
      <HtmlContainer position={[5, 3, 0]}>
        <SectionChooseProject />
      </HtmlContainer>

      {/* Section Contact */}
      <HtmlContainer position={[8, 3, 0]}>
        <SectionContact />
      </HtmlContainer>

      {/* Section Projects */}
      <HtmlContainer position={[13, 3, 0]}>
        <SectionProjects />
      </HtmlContainer>

      {/* Section Installation */}
      <HtmlContainer position={[20, 3, 0]}>
        <SectionInstallation />
      </HtmlContainer>
    </group>
  );
};
