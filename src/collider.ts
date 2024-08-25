import { Contact } from 'planck'
import { Game } from './game'
import { Actor } from './actors/actor'

export class Collider {
  game: Game

  constructor (game: Game) {
    this.game = game
    this.game.world.on('begin-contact', contact => this.beginContact(contact))
    this.game.world.on('end-contact', contact => this.endContact(contact))
    this.game.world.on('pre-solve', contact => this.preSolve(contact))
  }

  beginContact (contact: Contact): void {
    const fixtureA = contact.getFixtureA()
    const fixtureB = contact.getFixtureB()
    const actorA = fixtureA.getBody().getUserData() as Actor
    const actorB = fixtureB.getBody().getUserData() as Actor
    const pairs = [
      [actorA, actorB],
      [actorB, actorA]
    ]
    pairs.forEach(pair => {
      const actor = pair[0]
      const otherActor = pair[1]
      actor.contactActors.push(otherActor)
    })
  }

  endContact (contact: Contact): void {
    const fixtureA = contact.getFixtureA()
    const fixtureB = contact.getFixtureB()
    const actorA = fixtureA.getBody().getUserData() as Actor
    const actorB = fixtureB.getBody().getUserData() as Actor
    const pairs = [
      [actorA, actorB],
      [actorB, actorA]
    ]
    pairs.forEach(pair => {
      const actor = pair[0]
      const otherActor = pair[1]
      actor.contactActors = actor.contactActors.filter(contactActor => contactActor.id !== otherActor.id)
    })
  }

  preSolve (contact: Contact): void {
    //
  }
}
