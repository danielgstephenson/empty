import { Game } from '../game'
import { GuideSummary } from './guideSummary'

export class GameSummary {
  guides: GuideSummary[]

  constructor (game: Game) {
    const guides = [...game.guides.values()]
    this.guides = guides.map(guide => new GuideSummary(guide))
  }
}
