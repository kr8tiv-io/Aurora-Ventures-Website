# Changelog

All notable changes to the Aurora Ventures website will be documented in this file.

## [2026-01-04] - Equity & Jarvis Media Pass

### Added
- Added transparent WebM treatments for `jarvis.mp4` and `equity.mp4` via ONNX matting.
- Integrated the Hybrid Model split layout with interactive equity media panel.
- Added founder social icon stack (LinkedIn, X, Linktree).

### Changed
- Replaced project backgrounds with local Aura videos and added circular project badges.
- Updated ONNX processing to close small mask gaps during video matting.

## [2026-01-02] - Documentation & Photo Refinement

### Added
- Created `CHANGELOG.md` to track project evolution.
- Expanded `README.md` with details on the new Audio System and Scroll-Read Manifesto.

### Changed
- **Architect Photo**: Refined the portrait of Matt Haynes. 
  - Cropped bottom to remove black line artifacts.
  - Scaled down for better balance within the "Architect" section.
- **Spectrum Section**: Fine-tuned "Zoom In" physics for the Spectrum Assembly, pulling the Visual Design card closer on start.
- **Code Card**: Swapped the large grid pattern for a subtle "Dot Matrix" (3px) to match the global site background.

## [2026-01-01] - Audio, Typography & Manifesto Upgrade

### Added
- **Neue Machina Font**: Implemented the Neue Machina font family across all headings and primary UI elements.
- **Enhanced Audio Player**: 
  - Added a pulsing ambient audio button in the hero section.
  - Robust error handling with console diagnostics and visual feedback.
  - Smooth volume ramping and loop support.

### Changed
- **Manifesto Animation**: Replaced the "Cinematic Reveal" with a "Scroll-Read" effect.
  - Text highlights word-by-word as the user scrolls.
  - Interactive mouse-hover glow and scale effects on individual words.
- **Spectrum Assembly**: Implemented the coordinate-based "Assembly" animation for the Spectrum section.

## [2025-12-31] - Initial Core Systems

### Added
- **Motion System**: Integrated Lenis for smooth momentum scrolling and GSAP for scroll-triggered animations.
- **Ethos Section**: Implemented the pinning "Shrink & Slide" sequence with WebM video integration.
- **Video Processing**: Developed `process_videos_onnx.py` for automated background removal for hero holograms.
