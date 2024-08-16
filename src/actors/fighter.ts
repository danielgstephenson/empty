import { Actor } from './actor'
import { Game } from '../game'
import { Vec2 } from 'planck'
import { clampVec, normalize } from '../math'
import { Torso } from '../features/torso'

export class Fighter extends Actor {
  static movePower = 0.15
  static maxSpeed = 1
  startTime = 0
  position = Vec2(0, 0)
  velocity = Vec2(0, 0)
  moveDir = Vec2(0, 0)
  torso: Torso
  team = 0

  constructor (game: Game, id: string) {
    super(game, id, {
      type: 'dynamic',
      bullet: true,
      linearDamping: 0,
      fixedRotation: true
    })
    this.startTime = performance.now()
    this.torso = new Torso(this)
    this.label = 'fighter'
    this.body.setMassData({
      mass: 1,
      center: Vec2(0.1, 0),
      I: 0.25
    })
    this.game.fighters.set(this.id, this)
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
    this.torso.alive = true
    this.updateConfiguration()
  }

  getSpawnPoint (): Vec2 {
    return Vec2(0, 0)
  }

  getAllies (): Fighter[] {
    const fighters = [...this.game.fighters.values()]
    return fighters.filter(fighter => fighter.team === this.team && fighter.id !== this.id)
  }

  getEnemies (): Fighter[] {
    const fighters = [...this.game.fighters.values()]
    return fighters.filter(fighter => fighter.team !== this.team)
  }

  getAllyDistance (position: Vec2): number {
    const allyDistances = this.getAllies().map(ally => {
      return Vec2.distance(ally.position, position)
    })
    return Math.min(...allyDistances)
  }

  preStep (): void {
    const moveDir = this.moveDir.length() > 0 ? this.moveDir : Vec2.mul(this.velocity, -1)
    const force = Vec2.mul(normalize(moveDir), Fighter.movePower)
    this.body.applyForce(force, this.body.getPosition())
  }

  updateConfiguration (): void {
    this.position = this.body.getPosition()
    this.velocity = clampVec(this.body.getLinearVelocity(), Fighter.maxSpeed)
    this.body.setLinearVelocity(this.velocity)
  }

  postStep (): void {
    if (this.removed) {
      this.game.world.destroyBody(this.body)
      this.game.fighters.delete(this.id)
      return
    }
    this.updateConfiguration()
    if (!this.torso.alive) this.respawn()
  }

  remove (): void {
    this.game.actors.delete(this.id)
    this.removed = true
  }
}
