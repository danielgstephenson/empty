import { Actor } from './actor'
import { Game } from '../game'
import { Vec2 } from 'planck'
import { dirToFrom, normalize } from '../math'
import { Core } from '../features/core'
import { Arena } from './arena'

export class Particle extends Actor {
  static movePower = 0.2
  static maxSpeed = 1
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
      linearDamping: 0.05,
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
      return
    }
    const repulsion = 10
    const exponent = 2
    this.position = this.body.getPosition()
    const leftDistance = Math.abs(this.position.x + Arena.hx)
    const rightDistance = Math.abs(this.position.x - Arena.hx)
    const bottomDistance = Math.abs(this.position.y + Arena.hy)
    const topDistance = Math.abs(this.position.y - Arena.hy)
    const leftForce = Vec2(repulsion / Math.pow(leftDistance, exponent), 0)
    const rightForce = Vec2(-repulsion / Math.pow(rightDistance, exponent), 0)
    const bottomForce = Vec2(0, repulsion / Math.pow(bottomDistance, exponent))
    const topForce = Vec2(0, -repulsion / Math.pow(topDistance, exponent))
    this.body.applyForce(leftForce, this.position)
    this.body.applyForce(rightForce, this.position)
    this.body.applyForce(bottomForce, this.position)
    this.body.applyForce(topForce, this.position)
    this.game.particles.forEach(otherParticle => {
      if (otherParticle.id !== this.id && otherParticle.team === this.team) {
        const otherPosition = otherParticle.body.getPosition()
        const distance = Math.max(Core.radius, Vec2.distance(this.position, otherPosition))
        const direction = dirToFrom(this.position, otherPosition)
        const force = Vec2.mul(direction, repulsion / Math.pow(distance, exponent))
        this.body.applyForce(force, this.body.getPosition())
      }
    })
  }

  postStep (): void {
    super.postStep()
    this.contacts.forEach(otherActor => {
      if (otherActor instanceof Particle) {
        const direction = dirToFrom(this.position, otherActor.position)
        const scale = 5
        const force = Vec2.mul(scale, direction)
        this.body.applyForceToCenter(force)
      }
    })
  }

  remove (): void {
    super.remove()
    this.game.particles.delete(this.id)
  }
}
