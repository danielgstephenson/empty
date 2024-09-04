import { Guide } from './actors/guide'
import { Game, Team } from './game'

export class Player {
  game: Game
  id: string
  joined = false
  guide?: Guide
  team?: Team

  constructor (game: Game, id: string, team: Team) {
    this.game = game
    this.id = id
    this.game.players.set(id, this)
  }

  join (): void {
    this.joined = true
    this.team = this.game.getSmallPlayerTeam()
    const spawnPoint = this.game.spawnPoints[this.team]
    this.guide = new Guide(this.game, this.team, spawnPoint.x, spawnPoint.y, this.id)
  }

  remove (): void {
    this.game.players.delete(this.id)
    if (this.guide != null) {
      this.guide.remove()
    }
  }
}
