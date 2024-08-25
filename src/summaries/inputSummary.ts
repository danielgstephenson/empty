import { Vec2 } from 'planck'
import { dirToFrom, normalize } from '../math'
import { Input } from '../public/input'

export class InputSummary {
  moveDir: Vec2

  constructor (input: Input) {
    // console.log(input.mouseButtons)
    if (input.isMouseButtonDown(0)) {
      console.log('mousePosition', input.mousePosition.x, input.mousePosition.y)
      console.log('cameraPosition', input.renderer.camera.position.x, input.renderer.camera.position.y)
      this.moveDir = dirToFrom(input.mousePosition, input.renderer.camera.position)
    } else {
      let x = 0
      let y = 0
      if (input.isKeyDown('KeyW') || input.isKeyDown('ArrowUp') || input.isKeyDown('KeyI')) y += 1
      if (input.isKeyDown('KeyS') || input.isKeyDown('ArrowDown') || input.isKeyDown('KeyK')) y -= 1
      if (input.isKeyDown('KeyA') || input.isKeyDown('ArrowLeft') || input.isKeyDown('KeyJ')) x -= 1
      if (input.isKeyDown('KeyD') || input.isKeyDown('ArrowRight') || input.isKeyDown('KeyL')) x += 1
      this.moveDir = normalize(Vec2(x, y))
    }
  }
}
