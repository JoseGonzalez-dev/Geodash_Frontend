import { useCallback, useMemo } from "react"
import Particles from "react-tsparticles"
import { loadSlim } from "tsparticles-slim"

export const StarsBackground = ({ mode = "space" }) => {
    const particlesInit = useCallback(async engine => {
        await loadSlim(engine)
    }, [])

    const particlesLoaded = useCallback(async container => {
        if (container) {
            container.refresh()
        }
    }, [])

    // Configuraciones según el modo - memoizado para evitar re-renders
    const config = useMemo(() => {
        const baseConfig = {
            fpsLimit: 60,
            interactivity: {
                events: {
                    onClick: { enable: false },
                    onHover: { enable: false },
                    resize: true,
                },
                modes: {
                    push: { enable: false },
                    remove: { enable: false },
                    bubble: { enable: false },
                    repulse: { enable: false },
                    grab: { enable: false },
                },
            },
            particles: {
                links: { enable: false },
                collisions: { enable: false },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: { default: "out" },
                    random: true,
                    straight: false,
                },
                shape: { type: "circle" },
            },
            detectRetina: true,
            pauseOnBlur: true,
            pauseOnOutsideViewport: true,
        }

        if (mode === "space") {
            // Configuración para página principal (espacio profundo)
            return {
                ...baseConfig,
                background: {
                    color: { value: "#0a0a0f" },
                },
                particles: {
                    ...baseConfig.particles,
                    color: { value: "#ffffff" },
                    move: {
                        ...baseConfig.particles.move,
                        speed: 0.3,
                    },
                    number: {
                        density: { enable: true, area: 800 },
                        value: 200,
                    },
                    opacity: {
                        value: 0.8,
                        animation: {
                            enable: true,
                            speed: 1,
                            minimumValue: 0.1,
                            sync: false,
                        },
                    },
                    size: {
                        value: { min: 1, max: 3 },
                        animation: {
                            enable: true,
                            speed: 2,
                            minimumValue: 0.5,
                            sync: false,
                        },
                    },
                },
            }
        } else if (mode === "atmosphere") {
            // Configuración para /game (atmósfera)
            return {
                ...baseConfig,
                background: {
                    color: { value: "#2c3b60" }, // Azul atmosférico
                },
                particles: {
                    ...baseConfig.particles,
                    color: { 
                        value: ["#ffffff", "#e0f2fe", "#bae6fd"] // Colores más suaves
                    },
                    move: {
                        ...baseConfig.particles.move,
                        speed: 0.2, // Más lento, como flotando
                    },
                    number: {
                        density: { enable: true, area: 1200 },
                        value: 100, // Menos partículas
                    },
                    opacity: {
                        value: 0.4, // Más tenues
                        animation: {
                            enable: true,
                            speed: 0.5,
                            minimumValue: 0.05,
                            sync: false,
                        },
                    },
                    size: {
                        value: { min: 0.5, max: 2 }, // Más pequeñas
                        animation: {
                            enable: true,
                            speed: 1,
                            minimumValue: 0.3,
                            sync: false,
                        },
                    },
                },
            }
        }
    }, [mode])

    return (
        <>
            <Particles
                id={`tsparticles-${mode}`}
                key={`stars-${mode}`}
                init={particlesInit}
                loaded={particlesLoaded}
                options={config}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 0,
                }}
            />
        </>
    )
}