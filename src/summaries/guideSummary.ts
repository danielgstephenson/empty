import { Vec2 } from 'planck'
import { Guide } from '../actors/guide'

export class GuideSummary {
  position: Vec2
  angle: number
  id: string
  team: number

  constructor (guide: Guide) {
    this.position = guide.body.getPosition()
    this.angle = guide.body.getAngle()
    this.id = guide.id
    this.team = guide.team
  }
}
