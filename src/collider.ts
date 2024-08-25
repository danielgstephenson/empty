import { Contact } from 'planck'
import { Game } from './game'
import { Actor } from './actors/actor'
import { Particle } from './actors/particle'

export class Collider {
  game: Game

  constructor (game: Game) {
    this.game = game
    this.game.world.on('begin-contact', contact => this.beginContact(contact))
    this.game.world.on('end-contact', contact => this.endContact(contact))
    this.game.world.on('pre-solve', contact => this.preSolve(contact))
  }

  beginContact (contact: Contact): void {
    //
  }

  endContact (contact: Contact): void {
    //
  }

  preSolve (contact: Contact): void {
    const collide = this.shouldCollide(contact)
    contact.setEnabled(collide)
  }

  shouldCollide (contact: Contact): boolean {
    const fixtureA = contact.getFixtureA()
    const fixtureB = contact.getFixtureB()
    const actorA = fixtureA.getBody().getUserData() as Actor
    const actorB = fixtureB.getBody().getUserData() as Actor
    if (!(actorA instanceof Particle)) return true
    if (!(actorB instanceof Particle)) return true
    if (actorA.team === actorB.team) return true
    if (actorA.driven) return false
    if (actorB.driven) return false
    return true
  }
}
