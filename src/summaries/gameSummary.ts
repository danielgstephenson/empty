import { Game } from '../game'
import { ParticleSummary } from './particleSummary'

export class GameSummary {
  particles: ParticleSummary[]

  constructor (game: Game) {
    const particles = [...game.particles.values()]
    this.particles = particles.map(particle => new ParticleSummary(particle))
  }
}
