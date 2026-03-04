'use client'

import { useEffect, useRef } from 'react'

interface Star {
    x: number
    y: number
    radius: number
    opacity: number
    twinkleSpeed: number
    twinkleDirection: number
}

export default function StarBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let width = 0
        let height = 0
        let pixelRatio = 1

        // Set canvas size with device pixel ratio for sharper rendering.
        const resize = () => {
            width = window.innerWidth
            height = window.innerHeight
            pixelRatio = Math.min(window.devicePixelRatio || 1, 2)

            canvas.width = Math.floor(width * pixelRatio)
            canvas.height = Math.floor(height * pixelRatio)
            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`

            ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
        }
        resize()
        window.addEventListener('resize', resize)

        // Create stars
        const stars: Star[] = Array.from({ length: 130 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.2 + 0.3,
            opacity: Math.random() * 0.5 + 0.1,
            twinkleSpeed: Math.random() * 0.005,
            twinkleDirection: Math.random() > 0.5 ? 1 : -1,
        }))

        // Animation loop
        let animationId: number
        const twoPi = Math.PI * 2

        const animate = () => {
            ctx.clearRect(0, 0, width, height)
            ctx.fillStyle = 'rgb(255, 255, 255)'

            for (let i = 0; i < stars.length; i += 1) {
                const star = stars[i]
                // Twinkle effect
                star.opacity += star.twinkleSpeed * star.twinkleDirection
                if (star.opacity >= 0.8 || star.opacity <= 0.1) {
                    star.twinkleDirection *= -1
                }

                // Draw star
                ctx.beginPath()
                ctx.arc(star.x, star.y, star.radius, 0, twoPi)
                ctx.globalAlpha = star.opacity
                ctx.fill()
            }
            ctx.globalAlpha = 1

            animationId = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            cancelAnimationFrame(animationId)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            aria-hidden="true"
        />
    )
}
