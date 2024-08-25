import { Actor } from './actor'
import { Game } from '../game'
import { Vec2 } from 'planck'
import { dirToFrom, normalize } from '../math'
import { Core } from '../features/core'

export class Particle extends Actor {
  static movePower = 5
  driven = false
  full = false
  team = 1
  moveDir = Vec2(0, 0)
  core: Core

  constructor (game: Game, x: number, y: number, id?: string) {
    id = id ?? String(game.particles.size + 1)
    super(game, id, {
      type: 'dynamic',
      bullet: true,
      linearDamping: 0,
      fixedRotation: true
    })
    this.label = 'particle'
    this.core = new Core(this)
    this.body.setMassData({
      mass: 1,
      center: Vec2(0, 0),
      I: 0.25
    })
    this.body.setPosition(Vec2(x, y))
    this.game.particles.set(this.id, this)
  }

  joinTeam (team: number): void {
    this.team = team
    this.respawn()
  }

  respawn (): void {
    const spawnPoint = this.getSpawnPoint()
    this.body.setPosition(spawnPoint)
    this.body.setLinearVelocity(Vec2(0, 0))
    this.body.setAngle(0)
    this.body.setAngularVelocity(0)
    this.core.alive = true
    this.updateConfiguration()
  }

  getSpawnPoint (): Vec2 {
    return Vec2(0, 0)
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
    if (this.driven) {
      const force = Vec2.mul(normalize(this.moveDir), Particle.movePower)
      this.body.applyForce(force, this.body.getPosition())
    }
  }

  postStep (): void {
    super.postStep()
    this.contacts.forEach(contact => {
      const vec2Value = contact.getWorldManifold(null)?.points[0]
      if (vec2Value != null) {
        const contactPosition = Vec2(vec2Value.x, vec2Value.y)
        const direction = dirToFrom(this.position, contactPosition)
        const scale = 10
        const force = Vec2.mul(scale, direction)
        this.body.applyForceToCenter(force)
      }
    })
    // this.contacts.forEach(otherActor => {
    //   if (otherActor instanceof Particle) {
    //     const direction = dirToFrom(this.position, otherActor.position)
    //     const scale = 5
    //     const force = Vec2.mul(scale, direction)
    //     this.body.applyForceToCenter(force)
    //   }
    // })
  }

  remove (): void {
    super.remove()
    this.game.particles.delete(this.id)
  }
}
