import { Player } from '../player'
import { GameSummary } from './gameSummary'

export class PlayerSummary {
  game: GameSummary
  id: string
  joined: boolean

  constructor (player: Player) {
    this.game = player.game.summary
    this.id = player.id
    this.joined = player.joined
  }
}
