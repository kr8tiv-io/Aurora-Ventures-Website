document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("loaded");

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
        lerp: 0.08,
        wheelMultiplier: 1,
        smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const supportsClipPath = CSS.supports("clip-path", "inset(10% 10% 10% 10% round 20px)");

    const heroBackup = document.querySelector(".hero-title-backup");
    const heroSplit = heroBackup && window.SplitType
        ? new SplitType(heroBackup, { types: "chars" })
        : null;

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

            card.prepend(border);
            card.prepend(layer);
        }

        card.addEventListener("pointermove", (event) => {
            if (event.pointerType && event.pointerType !== "mouse") {
                return;
            }
            const rect = card.getBoundingClientRect();
            card.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
            card.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
            card.style.setProperty("--spotlight-opacity", "1");
        });

        card.addEventListener("pointerleave", () => {
            card.style.setProperty("--spotlight-opacity", "0");
        });
    });

    if (!prefersReducedMotion) {
        const magneticButtons = document.querySelectorAll(".magnetic-btn");

        magneticButtons.forEach((btn) => {
            const text = btn.querySelector(".btn-text");

            btn.addEventListener("mousemove", (event) => {
                const rect = btn.getBoundingClientRect();
                const strength = parseFloat(btn.getAttribute("data-strength") || "30");
                const x = event.clientX - rect.left - rect.width / 2;
                const y = event.clientY - rect.top - rect.height / 2;

                gsap.to(btn, {
                    x: x * (strength / 100),
                    y: y * (strength / 100),
                    duration: 0.3,
                    ease: "power2.out"
                });

                if (text) {
                    gsap.to(text, {
                        x: x * (strength / 150),
                        y: y * (strength / 150),
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });

            btn.addEventListener("mouseleave", () => {
                const targets = text ? [btn, text] : [btn];
                gsap.to(targets, {
                    x: 0,
                    y: 0,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.35)"
                });
            });
        });
    }

    const intro = gsap.timeline({
        defaults: { ease: "power3.out" }
    });

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

    intro.from(".hero-top span", {
        y: 16,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12
    }, "-=0.7");

    if (heroSplit) {
        intro.set(heroBackup, { opacity: 1 });
        intro.fromTo(heroSplit.chars, {
            y: 80,
            opacity: 0,
            rotateX: -45
        }, {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.1,
            stagger: 0.03
        }, "-=0.55");
        intro.to(heroBackup, {
            opacity: 0,
            duration: 0.9
        }, "-=0.6");
    } else {
        intro.from(".hero-title", {
            y: 32,
            opacity: 0,
            duration: 0.9
        }, "-=0.55");
    }

    intro.from(".hero-subtitle", {
        y: 18,
        opacity: 0,
        duration: 0.6
    }, "-=0.55");

    intro.from(".hero-lede", {
        y: 18,
        opacity: 0,
        duration: 0.6
    }, "-=0.5");

    intro.from(".hero-actions .btn", {
        y: 12,
        opacity: 0,
        duration: 0.55,
        stagger: 0.12
    }, "-=0.45");

    intro.from(".hero-rail .rail-item", {
        y: 12,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08
    }, "-=0.45");

    intro.from(".hero-cards .glass-card", {
        y: 36,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12
    }, "-=0.2");

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
            y: 60,
            scale: 0.96,
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
    if (manifestoText && window.SplitType) {
        const manifestoSplit = new SplitType(manifestoText, { types: "words" });

        gsap.fromTo(manifestoSplit.words, {
            color: "rgba(243, 246, 255, 0.2)",
            opacity: 0.35
        }, {
            color: "#ffffff",
            opacity: 1,
            textShadow: "0 0 16px rgba(255, 255, 255, 0.45)",
            stagger: 0.08,
            scrollTrigger: {
                trigger: ".manifesto",
                start: "top 70%",
                end: "bottom 30%",
                scrub: true
            }
        });
    }

    const projectsSection = document.querySelector(".projects-section");
    const projectsTrack = document.querySelector(".projects-track");
    if (projectsSection && projectsTrack) {
        const mm = gsap.matchMedia();

        mm.add("(min-width: 981px)", () => {
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
});
