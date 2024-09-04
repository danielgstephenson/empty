import { Vec2 } from 'planck'
import { Renderer } from './renderer'

export class Input {
  keyboard = new Map<string, boolean>()
  mousePosition = Vec2(0, 0)
  mouseButtons = new Map<number, boolean>()
  renderer: Renderer
  active = false

  constructor (renderer: Renderer) {
    this.renderer = renderer
    window.onkeydown = (event: KeyboardEvent) => this.onkeydown(event)
    window.onkeyup = (event: KeyboardEvent) => this.onkeyup(event)
    window.onwheel = (event: WheelEvent) => this.onwheel(event)
    window.onmousemove = (event: MouseEvent) => this.onmousemove(event)
    window.onmousedown = (event: MouseEvent) => this.onmousedown(event)
    window.onmouseup = (event: MouseEvent) => this.onmouseup(event)
    window.ontouchmove = (event: TouchEvent) => this.ontouchmove(event)
    window.ontouchstart = (event: TouchEvent) => this.ontouchstart(event)
    window.ontouchend = (event: TouchEvent) => this.ontouchend(event)
    window.oncontextmenu = () => {}
  }

  onkeydown (event: KeyboardEvent): void {
    this.keyboard.set(event.code, true)
    this.active = true
  }

  onkeyup (event: KeyboardEvent): void {
    this.keyboard.set(event.code, false)
  }

  isKeyDown (key: string): boolean {
    return this.keyboard.get(key) ?? false
  }

  onwheel (event: WheelEvent): void {
    this.renderer.camera.adjustZoom(-0.01 * event.deltaY)
    // console.log('zoom', this.renderer.camera.zoom)
  }

  onmousemove (event: MouseEvent): void {
    this.updateMousePosition(event)
  }

  onmousedown (event: MouseEvent): void {
    this.mouseButtons.set(event.button, true)
    this.updateMousePosition(event)
    this.active = true
  }

  onmouseup (event: MouseEvent): void {
    this.mouseButtons.set(event.button, false)
    this.updateMousePosition(event)
  }

  ontouchmove (event: TouchEvent): void {
    this.mousePosition.x = event.touches[0].clientX - 0.5 * window.innerWidth
    this.mousePosition.y = 0.5 * window.innerHeight - event.touches[0].clientY
  }

  ontouchstart (event: TouchEvent): void {
    this.mouseButtons.set(0, true)
    this.mousePosition.x = event.touches[0].clientX - 0.5 * window.innerWidth
    this.mousePosition.y = 0.5 * window.innerHeight - event.touches[0].clientY
  }

  ontouchend (event: TouchEvent): void {
    this.mouseButtons.set(0, false)
  }

  isMouseButtonDown (button: number): boolean {
    return this.mouseButtons.get(button) ?? false
  }

  updateMousePosition (event: MouseEvent): void {
    const screenX = event.clientX - 0.5 * window.innerWidth
    const screenY = 0.5 * window.innerHeight - event.clientY
    const transform = this.renderer.context.getTransform()
    const scale = Vec2(1 / transform.a, -1 / transform.d)
    const x = scale.x * screenX
    const y = scale.y * screenY
    this.mousePosition = Vec2(x, y)
    this.renderer.mousePosition = Vec2(x, y)
  }
}
