# Aurora Ventures Website

Aurora Ventures is a blockchain venture arm building **J.A.R.V.I.S** and operating as the incubation studio for the Aura project line. This site is the public-facing flagship: a cinematic, high-fidelity experience that communicates the studio’s ethos, services, and internal ventures while showcasing the studio’s craft.

## Contents
- About Aurora Ventures
- Vibe & Visual Narrative
- Style Guide
- Experience Map (Sections)
- Tech Stack
- Asset Pipeline
- Local Development
- Project Status

## About Aurora Ventures
Aurora Ventures is a blockchain venture arm focused on long-horizon infrastructure and ecosystem design. We are currently building **J.A.R.V.I.S**, a decentralized Life Operating System. Aurora also operates as the **incubation arm** for the Aura projects (Aura B&B, Aura H2O, Aura Farming) and as the **service arm** for founders across the industry—bridging design, engineering, and growth into a single studio model.

## Vibe & Visual Narrative
**Tone**: Cold, precise, luminous. The experience feels like looking through glass into a living system.

**Narrative Motifs**:
- **Aurora Light**: Ethereal gradients and star grids suggest a living, intelligent environment.
- **Glass + Metal**: Frosted glass layers and subtle reflections evoke premium, engineered systems.
- **Cinematic Flow**: Sections glide and lock into place, maintaining a controlled, deliberate tempo.

## Style Guide
### Color System
- **Midnight Base**: `#0a0e1c`
- **Aurora Teal**: `#7af8d6`
- **Ice Blue**: `#6cc9ff`
- **Deep Green / Cyan**: `#10241e` to `#060f0c`

### Typography
- **Primary**: Neue Machina (headline + UI)
- **Body**: System sans fallback stack for stability
- **Tracking**: Wide letter-spacing for labels and category text

### Materials & Surface
- **Frosted Glass**: `backdrop-filter: blur(...)` with soft borders
- **Star Grid**: low-opacity dot matrices and thin-line grids
- **Glow**: controlled bloom around key headings and accents

### Motion Principles
- **Slow, weighty movement** (Lenis + GSAP)
- **Pinned sequences** to make ideas feel engineered
- **Parallax + tilt** to add subtle depth without chaos

## Experience Map
- **Hero**: Aurora Ventures identity with audio-reactive UI and cinematic depth.
- **Manifesto**: Scroll-read typography that lights up as you move through the message.
- **Ethos**: Code-as-liberty visual moment with interactive video spin.
- **Spectrum**: Service grid with assembly animation and beam effects.
- **Hybrid Model**: Services for Equity with transparent video treatment.
- **Projects**: Horizontally-scrolling internal venture cards (Aura B&B, Aura H2O, Aura Farming).
- **J.A.R.V.I.S**: A central product highlight with holographic video treatment.
- **Founder**: Architect section with minimal portrait and social system.

## Tech Stack
- **HTML / CSS / JS** (no framework)
- **GSAP** (ScrollTrigger, MatchMedia)
- **Lenis** for momentum scrolling
- **SplitType** for animated text
- **Font Awesome** for iconography

## Asset Pipeline
Custom scripts are used to remove video backgrounds and generate transparent WebM assets:
- **U2Net (ONNX)** for matting
- **moviepy / OpenCV** for frame processing

Key scripts:
- `process_videos_onnx.py` – batch processing with solid-fill mask refinement

## Local Development
1. Create a virtual environment and install dependencies:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
2. Open `index.html` with a local server (VS Code Live Server recommended).

## Project Status
- [x] Hero (audio + tilt)
- [x] Manifesto (scroll-read)
- [x] Ethos (interactive video)
- [x] Spectrum (assembly + beam)
- [x] Hybrid Model (equity video)
- [x] Projects (horizontal GSAP)
- [x] J.A.R.V.I.S (transparent hero video)
- [x] Founder (portrait + socials)

---

Built with intention for Aurora Ventures.
