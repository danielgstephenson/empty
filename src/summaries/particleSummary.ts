import { Vec2 } from 'planck'
import { Particle } from '../actors/particle'

export class ParticleSummary {
  position: Vec2
  full: boolean
  id: string
  team: number

  constructor (particle: Particle) {
    this.position = particle.body.getPosition()
    this.full = particle.full
    this.id = particle.id
    this.team = particle.team
  }
}
