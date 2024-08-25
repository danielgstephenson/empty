import { Chain, Vec2 } from 'planck'
import { Actor } from '../actors/actor'
import { Feature } from './feature'
import { range } from '../math'

export class Boundary extends Feature {
  constructor (actor: Actor, radius: number) {
    const vertices: Vec2[] = []
    const pointCount = 400
    range(1, pointCount).forEach(i => {
      const angle = 2 * Math.PI * i / pointCount
      const x = radius * Math.cos(angle)
      const y = radius * Math.sin(angle)
      const vertex = Vec2(x, y)
      vertices.push(vertex)
    })
    const chain = new Chain(vertices, true)
    super(actor, {
      shape: chain,
      friction: 0,
      restitution: 1
    })
    this.label = 'wall'
  }
}
