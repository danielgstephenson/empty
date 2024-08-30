import { Contact } from 'planck'
import { Game } from './game'
import { Actor } from './actors/actor'
import { Particle } from './actors/particle'
export class Collider {
  game: Game

  constructor (game: Game) {
    this.game = game
    this.game.world.on('pre-solve', contact => this.preSolve(contact))
    this.game.world.on('begin-contact', contact => this.beginContact(contact))
    this.game.world.on('end-contact', contact => this.endContact(contact))
  }

  preSolve (contact: Contact): void {
    // const fixtureA = contact.getFixtureA()
    // const fixtureB = contact.getFixtureB()
    // const actorA = fixtureA.getBody().getUserData() as Actor
    // const actorB = fixtureB.getBody().getUserData() as Actor
    // const mobileA = actorA instanceof Particle || actorA instanceof Guide
    // const mobileB = actorB instanceof Particle || actorB instanceof Guide
    // if (mobileA && actorB instanceof Guide) {
    //   contact.setEnabled(false)
    //   return
    // }
    // if (mobileB && actorA instanceof Guide) {
    //   contact.setEnabled(false)
    // }
  }

  beginContact (contact: Contact): void {
    const fixtureA = contact.getFixtureA()
    const fixtureB = contact.getFixtureB()
    const actorA = fixtureA.getBody().getUserData() as Actor
    const actorB = fixtureB.getBody().getUserData() as Actor
    if (!(actorA instanceof Particle)) return
    if (!(actorB instanceof Particle)) return
    const transfer = actorA.full !== actorB.full
    if (transfer) {
      actorA.full = !actorA.full
      actorB.full = !actorB.full
    }
  }

  endContact (contact: Contact): void {
    //
  }
}
