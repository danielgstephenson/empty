import { Actor } from './actor'
import { Game, Team } from '../game'
import { Vec2 } from 'planck'
import { normalize } from '../math'
import { Core } from '../features/core'

export class Particle extends Actor {
  movePower = 4
  piloted = false
  full = false
  team: Team
  moveDir = Vec2(0, 0)
  core: Core

  constructor (game: Game, team: 1 | 2, x: number, y: number, id?: string) {
    id = id ?? String(game.particles.size + 1)
    super(game, id, {
      type: 'dynamic',
      bullet: true,
      linearDamping: 0,
      fixedRotation: true
    })
    this.label = 'particle'
    this.team = team
    this.core = new Core(this)
    this.body.setMassData({
      mass: 1,
      center: Vec2(0, 0),
      I: 0.25
    })
    this.body.setPosition(Vec2(x, y))
    this.updateConfiguration()
    this.game.particles.set(this.id, this)
  }

  getAllies (): Particle[] {
    const particles = [...this.game.particles.values()]
    return particles.filter(particle => particle.team === this.team && particle.id !== this.id)
  }

  getEnemies (): Particle[] {
    const particles = [...this.game.particles.values()]
    return particles.filter(particle => particle.team !== this.team)
  }

  getAllyDistance (position: Vec2): number {
    const allyDistances = this.getAllies().map(ally => {
      return Vec2.distance(ally.position, position)
    })
    return Math.min(...allyDistances)
  }

  preStep (): void {
    if (this.piloted) {
      const force = Vec2.mul(normalize(this.moveDir), this.movePower)
      this.body.applyForceToCenter(force)
    }
  }

  postStep (): void {
    super.postStep()
  }

  remove (): void {
    super.remove()
    this.game.particles.delete(this.id)
  }
}
