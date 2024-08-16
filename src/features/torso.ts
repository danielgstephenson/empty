import { Circle, Vec2 } from 'planck'
import { Guide } from '../actors/guide'
import { Feature } from './feature'

export class Torso extends Feature {
  static radius = 0.5
  guide: Guide
  alive = true

  constructor (guide: Guide) {
    super(guide, {
      shape: new Circle(Vec2(0, 0), Torso.radius),
      density: 1,
      friction: 0,
      restitution: 0
    })
    this.guide = guide
    this.label = 'torso'
  }
}
