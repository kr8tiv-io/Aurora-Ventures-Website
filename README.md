# Aurora Ventures Website

A high-fidelity, immersive portfolio website for Aurora Ventures, a blockchain venture studio. The design aesthetic is "Cyber-Tundra"—combining luminous aurora tones, cold frosted glass, and seamless cinematic motion.

## Visual & Motion System

### The "Cyber-Tundra" Aesthetic
- **Atmosphere**: Deep midnight blues (`#0a0e1c`) with bioluminescent teal accents (`#7af8d6`).
- **Materials**: Frosted glass panels (`backdrop-filter: blur`), subtle grain, and starry grid overlays.
- **Motion**: Slow, deliberate, and weight-bearing. Using **Lenis** for smooth momentum scrolling.

### Key Animations
- **Hero Section**:
  - **3D Kinetic Tilt**: The main "stage" tilts backward (`rotateX`) as you scroll, creating depth.
  - **Video Holograms**: Background-less videos (processed via U2Net) float above the cards.
- **Manifesto**:
  - **Cinematic Reveal**: Text ignites from a blurry "void" state to crisp white heat as it enters the viewport.
- **Ethos Section**:
  - **Pinned "Shrink & Slide"**: The section pins for 300% of the viewport. The "Code is Liberty" card shrinks and moves left to make room for the "Principles" card sliding in.
- **Interactions**:
  - **Hyper-Expansion**: Partner logos scale up 2x with a teal flash on hover.
  - **Traveling Beam**: Borrows a beam of light that travels around the borders of active cards.

## Technology Stack

- **Core**: HTML5, CSS3 (Variables & Glassmorphism), Vanilla JS.
- **Animation**: [GSAP](https://greensock.com/) (ScrollTrigger, MatchMedia).
- **Typography**: [SplitType](https://github.com/lukeed/split-type) for precise text motion.
- **Smoothing**: [Lenis](https://github.com/studio-freight/lenis) for inertial scrolling.
- **Asset Processing**: Custom Python scripts (`process_videos_onnx.py`) using U2Net for high-fidelity video background removal.

## Local Development

1. **Install Dependencies** (for asset processing):
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
2. **Run the Site**:
   Simply open `index.html` in your browser or use a live server.

## Status
- [x] Hero Section (3D, Video, Nav)
- [x] Manifesto (Cinematic Reveal)
- [x] Ethos (Pinned Animation, Video Integration)
- [x] Partnership (Grid, Logo Effects)
- [ ] Portfolio/Projects Section (Next Phase)
