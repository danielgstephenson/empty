import { Actor } from './actor'
import { Game, Team } from '../game'
import { Vec2 } from 'planck'
import { Core } from '../features/core'

export class Particle extends Actor {
  static radius = 0.7
  full = false
  team: Team
  moveDir = Vec2(0, 0)
  id: string
  core: Core

  constructor (game: Game, team: 1 | 2, x: number, y: number) {
    const id = String(game.particles.size + 1)
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
    this.game.particles.set(this.id, this)
  }

  preStep (): void {
    // const centerPower = 0.1
    // const centerForce = Vec2.mul(-centerPower, this.position)
    // this.body.applyForceToCenter(centerForce)
  }

  postStep (): void {
    super.postStep()
  }

  remove (): void {
    super.remove()
    this.game.particles.delete(this.id)
  }
}
