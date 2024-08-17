import { Vec2 } from 'planck'
import { Particle } from '../actors/particle'

export class GuideSummary {
  position: Vec2
  angle: number
  id: string
  team: number

  constructor (guide: Particle) {
    this.position = guide.body.getPosition()
    this.angle = guide.body.getAngle()
    this.id = guide.id
    this.team = guide.team
  }
}
