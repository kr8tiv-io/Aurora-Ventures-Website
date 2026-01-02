// Force scroll on load
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
}

document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("loaded");

    gsap.registerPlugin(ScrollTrigger);
    gsap.ticker.lagSmoothing(0);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const supportsClipPath = CSS.supports("clip-path", "inset(10% 10% 10% 10% round 20px)");
    const allowCustomCursor = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const lenis = new Lenis({
        lerp: 0.08,
        wheelMultiplier: 1,
        smoothWheel: true,
    });

    const nav = document.querySelector(".nav");
    let lastNavScroll = 0;
    const navRevealOffset = 120;
    const navDelta = 6;

    lenis.on("scroll", (event) => {
        ScrollTrigger.update();

        if (!nav) {
            return;
        }

        const currentScroll = event.scroll;
        const delta = currentScroll - lastNavScroll;

        if (Math.abs(delta) < navDelta) {
            return;
        }

        if (currentScroll <= navRevealOffset) {
            nav.classList.remove("is-hidden");
        } else if (delta > 0) {
            nav.classList.add("is-hidden");
        } else {
            nav.classList.remove("is-hidden");
        }

        lastNavScroll = currentScroll;
    });

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    // Custom cursor removed

    // Star Streak Spawner (Hero Grid + Partnership) - Vertical streaks along grid lines
    if (!prefersReducedMotion) {
        const starLayers = document.querySelectorAll(".grid-star-layer");
        starLayers.forEach(starLayer => {
            const maxConcurrent = 3;
            let activeStreaks = 0;

            function spawnStreak() {
                if (activeStreaks >= maxConcurrent) return;

                const streak = document.createElement("span");
                streak.className = "grid-streak";

                // Position on grid lines (80px intervals match the grid)
                const gridInterval = 80;
                const layerWidth = starLayer.offsetWidth || 1000;
                const numColumns = Math.floor(layerWidth / gridInterval);
                const column = Math.floor(Math.random() * numColumns);
                const xPos = column * gridInterval;

                // Randomize vertical properties
                const len = 120 + Math.random() * 100;    // 120-220px length
                const travel = 300 + Math.random() * 200; // 300-500px travel distance
                const dur = 2500 + Math.random() * 1500;  // 2.5-4s duration (slow)

                streak.style.cssText = `
                    left: ${xPos}px;
                    top: -${len}px;
                    --streak-len: ${len}px;
                    --streak-travel: ${travel + len}px;
                    animation: streak-vertical ${dur}ms linear 1;
                `;

                starLayer.appendChild(streak);
                activeStreaks++;

                streak.addEventListener("animationend", () => {
                    streak.remove();
                    activeStreaks--;
                });
            }

            function schedule() {
                const next = 2000 + Math.random() * 2000; // 2-4s between spawns (slower)
                setTimeout(() => {
                    spawnStreak();
                    schedule();
                }, next);
            }
            schedule();

            // Horizontal streaks along grid rows
            let activeHorizontal = 0;
            const maxHorizontal = 2;

            function spawnHorizontalStreak() {
                if (activeHorizontal >= maxHorizontal) return;

                const streak = document.createElement("span");
                streak.className = "grid-streak-h";

                // Position on grid rows (80px intervals)
                const gridInterval = 80;
                const layerHeight = starLayer.offsetHeight || 600;
                const numRows = Math.floor(layerHeight / gridInterval);
                const row = Math.floor(Math.random() * numRows);
                const yPos = row * gridInterval;

                const len = 120 + Math.random() * 100;
                const travel = 400 + Math.random() * 300;
                const dur = 3000 + Math.random() * 2000;

                streak.style.cssText = `
                    left: -${len}px;
                    top: ${yPos}px;
                    --streak-len: ${len}px;
                    --streak-travel: ${travel + len}px;
                    animation: streak-horizontal ${dur}ms linear 1;
                `;

                starLayer.appendChild(streak);
                activeHorizontal++;

                streak.addEventListener("animationend", () => {
                    streak.remove();
                    activeHorizontal--;
                });
            }

            function scheduleHorizontal() {
                const next = 3000 + Math.random() * 3000; // 3-6s between spawns
                setTimeout(() => {
                    spawnHorizontalStreak();
                    scheduleHorizontal();
                }, next);
            }
            scheduleHorizontal();
        });
    }

    // Hero Audio Player
    const audioBtn = document.getElementById("heroAudioBtn");
    const heroAudio = document.getElementById("heroAudio");
    if (audioBtn && heroAudio) {
        audioBtn.addEventListener("click", () => {
            if (heroAudio.paused) {
                heroAudio.play();
                audioBtn.classList.add("playing");
                audioBtn.innerHTML = '<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
            } else {
                heroAudio.pause();
                audioBtn.classList.remove("playing");
                audioBtn.innerHTML = '<svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>';
            }
        });

        heroAudio.addEventListener("ended", () => {
            audioBtn.classList.remove("playing");
            audioBtn.innerHTML = '<svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>';
        });
    }

    const heroEmbed = document.querySelector(".hero-embed");

    const spotlightTargets = document.querySelectorAll(
        ".glass-card, .service-card, .cta-panel, .metric-card, .project-card"
    );

    spotlightTargets.forEach((card) => {
        if (!card.querySelector(".spotlight-layer")) {
            const layer = document.createElement("span");
            layer.className = "spotlight-layer";
            layer.setAttribute("aria-hidden", "true");

            const border = document.createElement("span");
            border.className = "spotlight-border";
            border.setAttribute("aria-hidden", "true");

            const reflection = document.createElement("span");
            reflection.className = "glass-reflection";
            reflection.setAttribute("aria-hidden", "true");

            card.prepend(reflection);
            card.prepend(border);
            card.prepend(layer);
        }

        let rect = null;
        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;
        let rafId = null;

        const updateSpotlight = () => {
            currentX += (targetX - currentX) * 0.22;
            currentY += (targetY - currentY) * 0.22;

            card.style.setProperty("--mouse-x", `${currentX}px`);
            card.style.setProperty("--mouse-y", `${currentY}px`);

            rafId = requestAnimationFrame(updateSpotlight);
        };

        const setTarget = (event) => {
            if (!rect) {
                rect = card.getBoundingClientRect();
            }
            targetX = event.clientX - rect.left;
            targetY = event.clientY - rect.top;

            if (!rafId) {
                rafId = requestAnimationFrame(updateSpotlight);
            }
        };

        card.addEventListener("pointerenter", (event) => {
            if (event.pointerType && event.pointerType !== "mouse") {
                return;
            }
            rect = card.getBoundingClientRect();
            currentX = event.clientX - rect.left;
            currentY = event.clientY - rect.top;
            targetX = currentX;
            targetY = currentY;
            card.style.setProperty("--spotlight-opacity", "1");

            if (!rafId) {
                rafId = requestAnimationFrame(updateSpotlight);
            }
        });

        card.addEventListener("pointermove", (event) => {
            if (event.pointerType && event.pointerType !== "mouse") {
                return;
            }
            setTarget(event);
        }, { passive: true });

        card.addEventListener("pointerleave", () => {
            card.style.setProperty("--spotlight-opacity", "0");
            rect = null;
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        });
    });

    const magneticButtons = document.querySelectorAll(".btn, .nav-cta");

    magneticButtons.forEach((btn) => {
        if (!btn.querySelector(".btn-sheen")) {
            const sheen = document.createElement("span");
            sheen.className = "btn-sheen";
            sheen.setAttribute("aria-hidden", "true");
            btn.appendChild(sheen);
        }

        btn.addEventListener("pointerenter", () => {
            const sheen = btn.querySelector(".btn-sheen");
            if (!sheen || prefersReducedMotion) {
                return;
            }

            gsap.fromTo(sheen, {
                x: "-120%",
                opacity: 0.6
            }, {
                x: "220%",
                opacity: 0,
                duration: 0.9,
                ease: "power2.inOut"
            });
        });

        // Magnetic pull effect removed
    });

    const intro = gsap.timeline({
        defaults: { ease: "power3.out" }
    });

    const heroWaveStart = "polygon(0 65%, 10% 60%, 20% 68%, 30% 58%, 40% 66%, 50% 55%, 60% 63%, 70% 52%, 80% 60%, 90% 48%, 100% 56%, 100% 100%, 0 100%)";
    const heroWaveEnd = "polygon(0 0, 10% 0, 20% 0, 30% 0, 40% 0, 50% 0, 60% 0, 70% 0, 80% 0, 90% 0, 100% 0, 100% 100%, 0 100%)";

    if (supportsClipPath) {
        gsap.set(".hero-stage", {
            clipPath: "inset(10% 12% 12% 10% round 36px)"
        });
    }

    intro.from(".nav-shell", {
        y: -30,
        opacity: 0,
        duration: 1.1
    });

    intro.fromTo(".hero-stage", {
        y: 36,
        scale: 0.97,
        filter: "blur(4px)"
    }, {
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.2
    }, 0.05);

    if (supportsClipPath) {
        intro.to(".hero-stage", {
            clipPath: "inset(0% 0% 0% 0% round 36px)",
            duration: 1.1
        }, 0.05);
    }

    intro.fromTo(".hero-top span", {
        y: 16,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.12
    }, "-=0.7");

    if (heroEmbed) {
        if (supportsClipPath) {
            gsap.set(heroEmbed, { clipPath: heroWaveStart });
        }

        intro.fromTo(heroEmbed, {
            y: 42,
            opacity: 0,
            filter: "blur(8px)"
        }, {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.05,
            ease: "power2.out"
        }, "-=0.55");

        if (supportsClipPath) {
            intro.to(heroEmbed, {
                clipPath: heroWaveEnd,
                duration: 1.1,
                ease: "power2.out"
            }, "-=1");
        }
    } else {
        intro.fromTo(".hero-title", {
            y: 32,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 0.9
        }, "-=0.55");
    }

    intro.fromTo(".hero-subtitle", {
        y: 18,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 0.6
    }, "-=0.55");

    intro.fromTo(".hero-lede", {
        y: 18,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 0.6
    }, "-=0.5");

    intro.fromTo(".hero-actions .btn", {
        y: 12,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 0.55,
        stagger: 0.12
    }, "-=0.45");

    intro.fromTo(".hero-rail .rail-item", {
        y: 12,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.08
    }, "-=0.45");

    // Hero cards scroll animation (Restored + Video Parallax)
    const heroCards = document.querySelector(".hero-cards");
    if (heroCards) {
        const cardCenter = document.querySelector(".hero-card-center");
        const cardLeft = document.querySelector(".hero-card-left");
        const cardRight = document.querySelector(".hero-card-right");

        if (cardCenter && cardLeft && cardRight) {
            let scrollAnimComplete = false;

            // Initial states
            gsap.set(cardCenter, { y: 120, opacity: 0 });
            gsap.set(cardLeft, { x: -180, opacity: 0 });
            gsap.set(cardRight, { x: 180, opacity: 0 });

            const cardsTl = gsap.timeline({
                scrollTrigger: {
                    trigger: heroCards,
                    start: "top 95%",
                    end: "top 20%",
                    scrub: 1.2,
                    onEnter: () => { scrollAnimComplete = false; },
                    onLeave: () => { scrollAnimComplete = true; },
                    onEnterBack: () => { scrollAnimComplete = true; },
                    onLeaveBack: () => { scrollAnimComplete = false; }
                }
            });

            cardsTl.to(cardCenter, {
                y: 0, opacity: 1, duration: 0.6, ease: "none"
            });
            cardsTl.to(cardLeft, {
                x: 0, opacity: 1, duration: 0.4, ease: "none"
            }, "-=0.2");
            cardsTl.to(cardRight, {
                x: 0, opacity: 1, duration: 0.4, ease: "none"
            }, "<");

            // Mouse Parallax for Cards + Videos
            const allHeroCards = [cardLeft, cardCenter, cardRight];
            const parallaxStrengths = [8, 5, 8];

            heroCards.addEventListener("mousemove", (e) => {
                if (!scrollAnimComplete) return;

                const rect = heroCards.getBoundingClientRect();
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const mouseX = e.clientX - rect.left - centerX;
                const mouseY = e.clientY - rect.top - centerY;

                const normX = mouseX / centerX;
                const normY = mouseY / centerY;

                allHeroCards.forEach((card, i) => {
                    const strength = parallaxStrengths[i];
                    const video = card.querySelector(".card-floating-video");

                    // Card Movement
                    gsap.to(card, {
                        x: normX * strength,
                        y: normY * strength * 0.4,
                        rotateY: normX * 2,
                        rotateX: -normY * 1.5,
                        duration: 1,
                        ease: "power2.out"
                    });

                    // Video Movement (Deep Parallax - moves opposite/more)
                    if (video) {
                        gsap.to(video, {
                            x: -normX * strength * 1.5, // Moves opposite
                            y: -normY * strength * 1.5,
                            duration: 1.2,
                            ease: "power2.out"
                        });
                    }
                });
            }, { passive: true });

            heroCards.addEventListener("mouseleave", () => {
                if (!scrollAnimComplete) return;
                allHeroCards.forEach((card) => {
                    gsap.to(card, { x: 0, y: 0, rotateY: 0, rotateX: 0, duration: 0.8 });
                    const video = card.querySelector(".card-floating-video");
                    if (video) gsap.to(video, { x: 0, y: 0, duration: 0.8 });
                });
            });

            // Card Video Hover Interaction
            heroCards.querySelectorAll(".card-floating-video").forEach((wrapper) => {
                const video = wrapper.querySelector("video");
                wrapper.addEventListener("mouseenter", () => {
                    if (video) video.pause();
                    gsap.to(wrapper, { scale: 1.1, duration: 0.3, ease: "power2.out" });
                });
                wrapper.addEventListener("mouseleave", () => {
                    if (video) video.play();
                    gsap.to(wrapper, { scale: 1, duration: 0.3, ease: "power2.out" });
                });
            });
        }
    }

    document.querySelectorAll(".orb").forEach((orb, index) => {
        const speed = parseFloat(orb.dataset.speed || "1");
        gsap.to(orb, {
            y: -30 * speed,
            x: 18 * speed,
            duration: 8 * speed + index * 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    });

    gsap.to(".aurora-layer", {
        backgroundPosition: "200% 0%",
        duration: 24,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
    });

    if (prefersReducedMotion) {
        return;
    }

    gsap.set([
        ".hero-stage",
        ".hero-cards",
        ".hero-title",
        ".hero-embed",
        ".hero-subtitle",
        ".hero-rail",
        ".cta-panel",
        ".metric-card",
        ".unicorn-embed"
    ], {
        transformOrigin: "50% 50%"
    });

    gsap.timeline({
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    })
        .to(".unicorn-embed", {
            scale: 1.06,
            ease: "none"
        }, 0)
        .to(".hero-stage", {
            y: 80,
            scale: 0.95,
            rotateX: 12,
            transformOrigin: "50% top",
            ease: "none"
        }, 0)
        .to(".hero-title", {
            y: -12,
            ease: "none"
        }, 0)
        .to(".hero-rail", {
            y: 16,
            ease: "none"
        }, 0)
        .to(".hero-cards", {
            y: 40,
            scale: 0.98,
            ease: "none"
        }, 0);

    gsap.utils.toArray(".reveal").forEach((el) => {
        gsap.fromTo(el, {
            y: 50,
            opacity: 0,
            filter: "blur(8px)"
        }, {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });

    const floatingHeadings = gsap.utils.toArray(".type-label, .section-title, .section-body")
        .filter((el) => !el.closest(".reveal"));

    floatingHeadings.forEach((el) => {
        gsap.fromTo(el, {
            y: 24,
            opacity: 0,
            filter: "blur(6px)"
        }, {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });

    gsap.utils.toArray(".principles li").forEach((item, index) => {
        gsap.fromTo(item, {
            x: -20,
            opacity: 0
        }, {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            delay: index * 0.05,
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });
    });

    gsap.utils.toArray(".section-split").forEach((section) => {
        const columns = section.children;
        if (columns.length < 2) {
            return;
        }

        gsap.to(columns[0], {
            y: -20,
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        gsap.to(columns[1], {
            y: 20,
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    gsap.utils.toArray(".cta-panel").forEach((panel) => {
        if (!panel.querySelector(".sheen")) {
            const sheen = document.createElement("span");
            sheen.className = "sheen";
            sheen.setAttribute("aria-hidden", "true");
            panel.appendChild(sheen);
        }

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: panel,
                start: "top 85%",
                end: "top 55%",
                scrub: true
            }
        });

        tl.fromTo(panel, {
            scale: 0.96,
            y: 20
        }, {
            scale: 1,
            y: 0,
            ease: "none"
        }, 0);

        if (supportsClipPath) {
            tl.fromTo(panel, {
                clipPath: "inset(12% 10% 12% 10% round 32px)"
            }, {
                clipPath: "inset(0% 0% 0% 0% round 32px)",
                ease: "none"
            }, 0);
        }

        const sheen = panel.querySelector(".sheen");
        if (sheen) {
            tl.fromTo(sheen, {
                x: "-100%",
                opacity: 0.5
            }, {
                x: "200%",
                opacity: 0,
                duration: 1,
                ease: "power2.inOut"
            }, 0.2);
        }
    });

    gsap.utils.toArray(".metric-card").forEach((card, index) => {
        gsap.fromTo(card, {
            y: 20,
            opacity: 0,
            scale: 0.97
        }, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            delay: index * 0.05,
            scrollTrigger: {
                trigger: card,
                start: "top 88%",
                toggleActions: "play none none reverse"
            }
        });
    });

    const manifestoText = document.querySelector("#manifesto-text");
    // ----------------------------------------------------------------
    // 1. MANIFESTO: CINEMATIC REVEAL (Restored)
    // ----------------------------------------------------------------
    if (manifestoText && window.SplitType) {
        const manifestoSplit = new SplitType(manifestoText, { types: "words" });

        // Set Initial "Void" State (Blurry, faint teal, pushed down)
        gsap.set(manifestoSplit.words, {
            opacity: 0,
            filter: "blur(12px)",
            color: "rgba(122, 248, 214, 0)",
            y: 20,
            scale: 0.95
        });

        // Animate to "Ignition" (Sharp, White, Glowing)
        gsap.to(manifestoSplit.words, {
            opacity: 1,
            filter: "blur(0px)",
            color: "#ffffff",
            y: 0,
            scale: 1,
            textShadow: "0 0 25px rgba(122, 248, 214, 0.7)", // The "Ignition" Glow
            stagger: 0.08,             // Fast ripple effect
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".manifesto",
                start: "top 90%",      // STARTS IMMEDIATELY (Bottom of screen)
                end: "top 45%",        // FINISHES at Center
                scrub: 1
            }
        });
    }

    // ----------------------------------------------------------------
    // 2. ETHOS: PINNED "SHRINK & SLIDE" (Fixed Timing)
    // ----------------------------------------------------------------
    const mm = gsap.matchMedia();

    mm.add("(min-width: 992px)", () => {
        const ethosSection = document.querySelector("#ethos");
        const codeCard = document.querySelector("#code-card");
        const principlesCard = document.querySelector("#principles-card");

        if (ethosSection && codeCard && principlesCard) {

            // Set Initial Positions BEFORE the ScrollTrigger starts
            // Code Card: Big (1.3x) and pushed to the Center (55% right)
            gsap.set(codeCard, {
                scale: 1.3,
                xPercent: 55,
                zIndex: 10,
                filter: "brightness(1.2)"
            });

            // Principles Card: Hidden off to the right
            gsap.set(principlesCard, {
                xPercent: 120,
                opacity: 0,
                scale: 0.9
            });

            // The Timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: "#ethos",
                    start: "top top",      // Locks as soon as it hits top
                    end: "+=300%",         // PINS for 300% (Triple duration = Slower)
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1
                }
            });

            // Phase 1: Shrink & Slide Left
            tl.to(codeCard, {
                scale: 1,
                xPercent: 0,           // Returns to left column
                filter: "brightness(1)",
                duration: 2,
                ease: "power2.inOut"
            }, "phase1");

            // Phase 2: Slide in Principles (Slightly overlapped)
            tl.to(principlesCard, {
                xPercent: 0,           // Slides into right column
                opacity: 1,
                scale: 1,
                duration: 2,
                ease: "power2.out"
            }, "phase1+=0.5");         // Starts 0.5s into the movement
        }
    });

    const projectsSection = document.querySelector(".projects-section");
    const projectsTrack = document.querySelector(".projects-track");
    if (projectsSection && projectsTrack) {
        const mm = gsap.matchMedia();

        mm.add("(min-width: 992px)", () => {
            const getScrollDistance = () => Math.max(0, projectsTrack.scrollWidth - projectsSection.clientWidth);
            if (getScrollDistance() <= 0) {
                return;
            }

            gsap.to(projectsTrack, {
                x: () => -getScrollDistance(),
                ease: "none",
                scrollTrigger: {
                    trigger: projectsSection,
                    start: "top top",
                    end: () => `+=${getScrollDistance()}`,
                    scrub: true,
                    pin: true,
                    refreshPriority: 1, // Calculates AFTER Spectrum is done
                    invalidateOnRefresh: true
                }
            });
        });
    }

    const founderMedia = document.querySelector(".founder-media");
    if (founderMedia) {
        gsap.from(".founder-image", {
            scale: 1.12,
            ease: "none",
            scrollTrigger: {
                trigger: founderMedia,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    }

    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
    });
    // Ethos Cube: 2D Spin (Steering Wheel Style) - +/- 30 Degrees
    // Ethos Cube: 2D Spin (Steering Wheel Style) - +/- 30 Degrees
    {
        const codeCard = document.querySelector("#code-card");
        const cubeVideo = document.querySelector("#ethos-cube-video");

        if (codeCard && cubeVideo) {
            console.log("Ethos Cube Loaded for Rotation");
            // Reset any 3D transforms - DO NOT use "all" as it wipes inline styles!
            gsap.set(cubeVideo, { clearProps: "transform" });
            gsap.set(cubeVideo, { transformOrigin: "center center" });

            codeCard.addEventListener("mousemove", (e) => {
                const rect = codeCard.getBoundingClientRect();
                // Map mouse X to -1 to 1
                const xPercent = ((e.clientX - rect.left) / rect.width - 0.5) * 2;

                // console.log("Rotate:", xPercent * 30); // Debug

                gsap.to(cubeVideo, {
                    rotation: xPercent * 30,   // 2D ROTATION (30 Deg Limit)
                    scale: 0.95,               // Shrink 5% on hover
                    rotationY: 0,              // Kill 3D
                    rotationX: 0,              // Kill 3D
                    x: 0,                      // Kill Slide
                    y: 0,                      // Kill Slide
                    duration: 0.5,
                    delay: 0.15,               // Slight delay before rotation starts
                    ease: "power2.out",
                    overwrite: "auto"
                });
            });

            codeCard.addEventListener("mouseleave", () => {
                gsap.to(cubeVideo, {
                    rotation: 0,               // Spin back to upright
                    scale: 1,                  // Restore size
                    duration: 1.2,
                    ease: "elastic.out(1, 0.3)"
                });
            });
        } else {
            console.warn("Ethos Cube Elements Not Found");
        }
    }

    // Partnership Section: 3D Tilt Animation (Scroll-Driven)
    // Tilts up on entry, flat in view, tilts down on exit
    {
        const partnershipPanel = document.querySelector(".partnership-panel");

        if (partnershipPanel) {
            // Set initial state and enable 3D
            gsap.set(partnershipPanel, {
                transformOrigin: "center center",
                transformPerspective: 1200
            });

            // Create the scroll-driven tilt animation
            gsap.timeline({
                scrollTrigger: {
                    trigger: partnershipPanel,
                    start: "top 90%",      // Start when top of panel hits 90% of viewport
                    end: "bottom 10%",     // End when bottom of panel hits 10% of viewport
                    scrub: 1.5,            // Buttery smooth scrubbing (1.5s lag)
                    // markers: true,      // Uncomment for debugging
                }
            })
                .fromTo(partnershipPanel,
                    { rotateX: 15, y: 50, opacity: 0.7 },     // Entry: Tilted up, pushed down, faded
                    { rotateX: 0, y: 0, opacity: 1, ease: "power2.out" },  // Middle: Flat and visible
                    0
                )
                .to(partnershipPanel,
                    { rotateX: -15, y: -50, opacity: 0.7, ease: "power2.in" },  // Exit: Tilted down, pushed up
                    0.5  // Start at 50% of timeline
                );
        }
    }

    // ----------------------------------------------------------------
    // 3. SPECTRUM ASSEMBLY (Pinned Scroll) - Desktop Only
    // ----------------------------------------------------------------
    // We use the same 'mm' context or create a new one to ensure it handles resizing correctly.
    const mmSpectrum = gsap.matchMedia();

    mmSpectrum.add("(min-width: 992px)", () => {
        const spectrumSec = document.querySelector("#spectrum");

        if (spectrumSec) {
            // 1. SETUP INITIAL STATES (Exploded View)
            gsap.set(".spectrum-header", { y: -150, opacity: 0 });
            gsap.set("#visual-card", { scale: 3, opacity: 0, zIndex: 50 });
            gsap.set("#strategy-card", { x: -800, opacity: 0, rotationY: 45 });
            gsap.set("#growth-card", { x: 800, opacity: 0, rotationY: -45 });
            gsap.set("#equity-card", { x: 600, y: 600, opacity: 0 });
            gsap.set("#dev-card", { x: -600, y: 600, opacity: 0 });

            // 2. THE TIMELINE
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: "#spectrum",
                    start: "top top",
                    end: "+=400%",
                    pin: true,
                    scrub: 1,
                    refreshPriority: 10, // Calculates FIRST
                    invalidateOnRefresh: true,
                    anticipatePin: 0 // Keep 0 to prevent jitter
                }
            });

            // Step 1: Visual Card "Appears"
            tl.to("#visual-card", {
                scale: 1,
                opacity: 1,
                duration: 1.5,
                ease: "power2.inOut"
            })
                // Step 2: Wings Enter
                .to(["#strategy-card", "#growth-card"], {
                    x: 0,
                    opacity: 1,
                    rotationY: 0,
                    duration: 1,
                    ease: "back.out(0.8)"
                }, "-=0.5")
                // Step 3: Header Drops In
                .to(".spectrum-header", {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out"
                }, "-=0.5")
                // Step 4: Equity Enters
                .to("#equity-card", {
                    x: 0,
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out"
                })
                // Step 5: Dev Enters
                .to("#dev-card", {
                    x: 0,
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out"
                }, "-=0.6");
        }
    });

});
