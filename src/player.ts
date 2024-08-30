import { Guide } from './actors/guide'
import { Game, Team } from './game'

export class Player {
  game: Game
  id: string
  guide: Guide

  constructor (game: Game, id: string, team: Team) {
    this.game = game
    this.id = id
    const spawnPoint = this.game.spawnPoints[team]
    this.guide = new Guide(game, team, spawnPoint.x, spawnPoint.y, id)
    this.game.players.set(id, this)
  }

  remove (): void {
    this.game.players.delete(this.id)
    this.guide.remove()
  }
}
