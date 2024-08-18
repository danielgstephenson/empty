import { Particle } from './actors/particle'
import { Game } from './game'

export class Player {
  game: Game
  id: string
  particle: Particle

  constructor (game: Game, id: string) {
    this.game = game
    this.id = id
    this.particle = new Particle(game, 0, 0, id)
    this.particle.driven = true
    this.game.players.set(id, this)
    this.joinTeam()
  }

  joinTeam (): void {
    this.particle.joinTeam(this.game.getSmallPlayerTeam())
  }

  remove (): void {
    this.particle.remove()
    this.game.players.delete(this.id)
  }
}
