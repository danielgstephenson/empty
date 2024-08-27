import { Core } from '../features/core'
import { PlayerSummary } from '../summaries/playerSummary'
import { Arena } from '../actors/arena'
import { Camera } from './camera'
import { ParticleSummary } from '../summaries/particleSummary'
import { Vec2 } from 'planck'

export class Renderer {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  camera = new Camera()
  particleSummaries: ParticleSummary[] = []

  color1 = 'rgb(0,20,255)'
  color2 = 'rgb(0,120,0)'
  id = ''

  constructor () {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D
    this.draw()
  }

  readSummary (summary: PlayerSummary): void {
    this.particleSummaries = summary.game.particles
    this.id = summary.id
  }

  draw (): void {
    window.requestAnimationFrame(() => this.draw())
    this.setupCanvas()
    this.cameraFollow()
    this.drawArena()
    this.particleSummaries.forEach(particle => {
      this.drawParticle(particle)
    })
  }

  drawParticle (particle: ParticleSummary): void {
    this.setupContext()
    this.context.save()
    this.context.globalAlpha = 1
    this.context.fillStyle = particle.team === 1 ? this.color1 : this.color2
    this.context.strokeStyle = particle.team === 1 ? this.color1 : this.color2
    this.context.lineWidth = 0.2
    this.context.beginPath()
    this.context.arc(
      particle.position.x,
      particle.position.y,
      Core.radius, 0, 2 * Math.PI
    )
    this.context.closePath()
    this.context.clip()
    if (particle.piloted) {
      this.context.stroke()
      this.context.lineWidth = 0.1
      const diagonal = Core.radius * Math.SQRT2 / 2
      this.context.moveTo(particle.position.x + diagonal, particle.position.y - diagonal)
      this.context.lineTo(particle.position.x - diagonal, particle.position.y + diagonal)
      this.context.moveTo(particle.position.x + diagonal, particle.position.y + diagonal)
      this.context.lineTo(particle.position.x - diagonal, particle.position.y - diagonal)
      this.context.stroke()
    } else {
      this.context.stroke()
    }
    if (particle.full) {
      this.context.fill()
    }
    this.context.restore()
  }

  drawArena (): void {
    this.setupContext()
    this.context.strokeStyle = 'hsl(0 0 30)'
    this.context.lineWidth = 1
    this.context.fillStyle = 'black'
    this.context.beginPath()
    this.context.rect(-Arena.hx, -Arena.hy, 2 * Arena.hx, 2 * Arena.hy)
    this.context.stroke()
    this.context.beginPath()
    this.context.rect(-Arena.hx, -Arena.hy, 2 * Arena.hx, 2 * Arena.hy)
    this.context.fill()
    this.context.strokeStyle = 'hsl(0 0 30)'
    this.context.lineWidth = 0.2
  }

  setupCanvas (): void {
    this.canvas.width = window.visualViewport?.width ?? window.innerWidth
    this.canvas.height = window.visualViewport?.height ?? window.innerHeight
  }

  getPlayerPosition (): Vec2 {
    let position = Vec2(0, 0)
    this.particleSummaries.forEach(particle => {
      if (particle.id === this.id) {
        position = particle.position
      }
    })
    return position
  }

  cameraFollow (): void {
    this.particleSummaries.forEach(particle => {
      if (particle.id === this.id) {
        this.camera.position = particle.position
      }
    })
  }

  setupContext (): void {
    this.context.resetTransform()
    this.context.translate(0.5 * this.canvas.width, 0.5 * this.canvas.height)
    const vmin = Math.min(this.canvas.width, this.canvas.height)
    this.context.scale(0.1 * vmin, -0.1 * vmin)
    const cameraScale = Math.exp(0.1 * this.camera.zoom - 1)
    this.context.scale(cameraScale, cameraScale)
    this.context.translate(-this.camera.position.x, -this.camera.position.y)
    this.context.globalAlpha = 1
  }
}
