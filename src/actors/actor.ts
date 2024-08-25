import { BodyDef, Body, Fixture, Vec2, Contact } from 'planck'
import { Game } from '../game'
import { clampVec } from '../math'

export class Actor {
  static count = 0
  game: Game
  body: Body
  id: string
  label = 'actor'
  removed = false
  maxSpeed = 5
  position = Vec2(0, 0)
  velocity = Vec2(0, 0)
  contacts: Contact[] = []

  constructor (game: Game, id: string, bodyDef: BodyDef) {
    if (game.actors.has(id)) {
      throw new Error(`Actor id ${id} is already in use.`)
    } else {
      this.game = game
      this.id = id
      this.body = this.game.world.createBody(bodyDef)
      this.body.setUserData(this)
      this.game.actors.set(this.id, this)
    }
  }

  updateConfiguration (): void {
    this.position = this.body.getPosition()
    this.contacts = this.getContacts()
    this.velocity = clampVec(this.body.getLinearVelocity(), this.maxSpeed)
    this.body.setLinearVelocity(this.velocity)
  }

  postStep (): void {
    if (this.removed) {
      this.game.world.destroyBody(this.body)
      this.game.particles.delete(this.id)
      return
    }
    this.updateConfiguration()
  }

  remove (): void {
    this.game.actors.delete(this.id)
    this.removed = true
  }

  getFixtures (): Fixture[] {
    const fixtures = []
    for (let fixture = this.body.getFixtureList(); fixture != null; fixture = fixture.getNext()) {
      fixtures.push(fixture)
    }
    return fixtures
  }

  getContacts (): Contact[] {
    const contacts: Contact[] = []
    for (let contactEdge = this.body.getContactList(); contactEdge != null; contactEdge = contactEdge.next) {
      contacts.push(contactEdge.contact)
    }
    return contacts
  }
}
