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
    const fixtureA = contact.getFixtureA()
    const fixtureB = contact.getFixtureB()
    const actorA = fixtureA.getBody().getUserData() as Actor
    const actorB = fixtureB.getBody().getUserData() as Actor
    if (!(actorA instanceof Particle)) return
    if (!(actorB instanceof Particle)) return
    const sameTeam = actorA.team === actorB.team
    const neitherPiloted = !actorA.piloted && !actorB.piloted
    const shouldCollide = sameTeam || neitherPiloted
    contact.setEnabled(shouldCollide)
  }

  beginContact (contact: Contact): void {
    const fixtureA = contact.getFixtureA()
    const fixtureB = contact.getFixtureB()
    const actorA = fixtureA.getBody().getUserData() as Actor
    const actorB = fixtureB.getBody().getUserData() as Actor
    if (!(actorA instanceof Particle)) return
    if (!(actorB instanceof Particle)) return
    const neitherPiloted = !actorA.piloted && !actorB.piloted
    const shouldTransfer = neitherPiloted && (actorA.full !== actorB.full)
    if (shouldTransfer) {
      actorA.full = !actorA.full
      actorB.full = !actorB.full
    }
  }

  endContact (contact: Contact): void {
    //
  }
}
