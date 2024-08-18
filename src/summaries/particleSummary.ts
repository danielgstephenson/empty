import { Vec2 } from 'planck'
import { Particle } from '../actors/particle'

export class ParticleSummary {
  position: Vec2
  angle: number
  id: string
  team: number
  driven: boolean

  constructor (particle: Particle) {
    this.position = particle.body.getPosition()
    this.angle = particle.body.getAngle()
    this.id = particle.id
    this.team = particle.team
    this.driven = particle.driven
  }
}
