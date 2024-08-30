import { Actor } from './actor'
import { Game, Team } from '../game'
import { Vec2 } from 'planck'
import { Core } from '../features/core'
import { normalize } from '../math'

export class Guide extends Actor {
  static radius = 1
  movePower = 2
  team: Team
  moveDir = Vec2(0, 0)
  core: Core
  id: string

  constructor (game: Game, team: 1 | 2, x: number, y: number, id: string) {
    super(game, id, {
      type: 'dynamic',
      bullet: true,
      linearDamping: 0,
      fixedRotation: true
    })
    this.id = id
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
    this.game.guides.set(this.id, this)
  }

  preStep (): void {
    const force = Vec2.mul(normalize(this.moveDir), this.movePower)
    this.body.applyForceToCenter(force)
    // const particles = [...this.game.particles.values()]
    // const teamParticles = particles.filter(particle => particle.team === this.team)
    // teamParticles.forEach(particle => {
    //   const direction = dirToFrom(particle.position, this.position)
    //   const distance = Vec2.distance(particle.position, this.position)
    //   const scale = 10 / (distance + 1)
    //   const force = Vec2.mul(scale, direction)
    //   particle.body.applyForceToCenter(force)
    // })
  }

  postStep (): void {
    super.postStep()
  }

  remove (): void {
    super.remove()
    this.game.guides.delete(this.id)
  }
}
