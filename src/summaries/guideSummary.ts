import { Vec2 } from 'planck'
import { Guide } from '../actors/guide'

export class GuideSummary {
  position: Vec2
  id: string
  team: number
  pullPositions: Vec2[]

  constructor (guide: Guide) {
    this.position = guide.body.getPosition()
    this.id = guide.id
    this.team = guide.team
    this.pullPositions = guide.pullPositions
  }
}
