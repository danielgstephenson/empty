import { Torso } from '../features/torso'
import { GuideSummary } from '../summaries/guideSummary'
import { PlayerSummary } from '../summaries/playerSummary'
import { Arena } from '../actors/arena'
import { Camera } from './camera'

export class Renderer {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
  camera = new Camera()
  guideSummaries: GuideSummary[] = []

  color1 = 'blue'
  color2 = 'rgb(0,120,0)'
  id = ''

  constructor () {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D
    this.draw()
  }

  readSummary (summary: PlayerSummary): void {
    this.guideSummaries = summary.game.guides
    this.id = summary.id
  }

  draw (): void {
    window.requestAnimationFrame(() => this.draw())
    this.setupCanvas()
    this.cameraFollow()
    this.drawArena()
    this.guideSummaries.forEach(guide => {
      this.drawTorso(guide)
    })
  }

  drawTorso (guide: GuideSummary): void {
    this.setupContext()
    this.context.fillStyle = guide.team === 1 ? this.color1 : this.color2
    this.context.beginPath()
    this.context.arc(
      guide.position.x,
      guide.position.y,
      Torso.radius, 0, 2 * Math.PI
    )
    this.context.fill()
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

  cameraFollow (): void {
    this.guideSummaries.forEach(guide => {
      if (guide.id === this.id) {
        this.camera.position = guide.position
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
