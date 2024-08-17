import { Particle } from './actors/particle'
import { Game } from './game'

export class Player {
  game: Game
  id: string
  guide: Particle

  constructor (game: Game, id: string) {
    this.game = game
    this.id = id
    this.guide = new Particle(game, id)
    this.game.players.set(id, this)
    this.joinTeam()
  }

  joinTeam (): void {
    this.guide.joinTeam(this.game.getSmallPlayerTeam())
  }

  remove (): void {
    this.guide.remove()
    this.game.players.delete(this.id)
  }
}
