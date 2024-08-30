import { Vec2 } from 'planck'
import { Guide } from '../actors/guide'

export class GuideSummary {
  position: Vec2
  id: string
  team: number

  constructor (guide: Guide) {
    this.position = guide.body.getPosition()
    this.id = guide.id
    this.team = guide.team
  }
}
