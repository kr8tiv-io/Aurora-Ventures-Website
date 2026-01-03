# Aurora Ventures Website

A high-fidelity, immersive portfolio website for Aurora Ventures, a blockchain venture studio. The design aesthetic is "Cyber-Tundra"—combining luminous aurora tones, cold frosted glass, and seamless cinematic motion.

## Visual & Motion System

### The "Cyber-Tundra" Aesthetic
- **Atmosphere**: Deep midnight blues (`#0a0e1c`) with bioluminescent teal accents (`#7af8d6`).
- **Materials**: Frosted glass panels (`backdrop-filter: blur`), subtle grain, and starry grid overlays.
- **Motion**: Slow, deliberate, and weight-bearing. Using **Lenis** for smooth momentum scrolling.

### Key Animations
- **Hero Section**:
  - **3D Kinetic Tilt**: The main stage tilts based on scroll position, emphasizing depth.
  - **Ambient Audio**: A robust audio player engine with pulsing HUD feedback and intelligent error handling.
- **Manifesto**:
  - **Scroll-Read Highlight**: Words ignite from dimmed gray to white as the user scrolls, combined with interactive mouse-hover glow effects.
- **Ethos & Spectrum**:
  - **The Assembly**: Cards fly in from 3D space to assemble the visual grid of the Spectrum section.
  - **Pinned "Shrink & Slide"**: Sophisticated pinning logic where content transitions smoothly through multiple stages.

## Audio & Immersive Systems

The site features an integrated **Ambient Audio Player** engineered for minimal friction:
- **Smart Loading**: Handles browser autoplay restrictions gracefully.
- **HUD Feedback**: Pulsing visual states and interactive iconography.
- **Fail-Safe**: Integrated error reporting and visual status indicators.

## Technology Stack

- **Core**: HTML5, CSS3, Vanilla JS.
- **Animation**: [GSAP](https://greensock.com/) (ScrollTrigger, MatchMedia), **Lenis** (Smooth Scroll).
- **Typography**: **Neue Machina** (Digital-native aesthetic), **SplitType** for text fragmentation.
- **Asset Processing**: Custom Python scripts for video background removal and image optimization.

## Local Development

1. **Install Dependencies** (for asset processing):
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
2. **Run the Site**: Open `index.html` via any local server (e.g., VS Code Live Server).

## Status
- [x] Hero Section (3D, Video, Audio)
- [x] Manifesto (Scroll-Read Highlight)
- [x] Ethos (Pinned Sequence)
- [x] Spectrum (The Assembly)
- [x] Partnership (Grid, Effects)
- [ ] Portfolio/Projects Section (Next Phase)
