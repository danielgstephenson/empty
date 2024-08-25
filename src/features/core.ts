import { Circle, Vec2 } from 'planck'
import { Particle } from '../actors/particle'
import { Feature } from './feature'

export class Core extends Feature {
  static radius = 0.5
  particle: Particle
  alive = true

  constructor (particle: Particle) {
    super(particle, {
      shape: new Circle(Vec2(0, 0), Core.radius),
      density: 1,
      friction: 0,
      restitution: 1
    })
    this.particle = particle
    this.label = 'core'
  }
}
