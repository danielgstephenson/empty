import { Particle } from './actors/particle'
import { Game, Team } from './game'

export class Player {
  game: Game
  id: string
  particle: Particle

  constructor (game: Game, id: string, team: Team) {
    this.game = game
    this.id = id
    const spawnPoint = this.game.spawnPoints[team]
    this.particle = new Particle(game, team, spawnPoint.x, spawnPoint.y, id)
    this.particle.piloted = true
    this.game.players.set(id, this)
  }

  remove (): void {
    this.game.players.delete(this.id)
    this.particle.remove()
  }
}
