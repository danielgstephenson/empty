import { Game } from '../game'
import { GuideSummary } from './guideSummary'
import { ParticleSummary } from './particleSummary'

export class GameSummary {
  particles: ParticleSummary[]
  guides: GuideSummary[]

  constructor (game: Game) {
    const particles = [...game.particles.values()]
    this.particles = particles.map(particle => new ParticleSummary(particle))
    const guides = [...game.guides.values()]
    this.guides = guides.map(guide => new GuideSummary(guide))
  }
}
