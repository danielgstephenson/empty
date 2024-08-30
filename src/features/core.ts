import { Circle, Vec2 } from 'planck'
import { Particle } from '../actors/particle'
import { Feature } from './feature'
import { Guide } from '../actors/guide'

export class Core extends Feature {
  radius: number
  actor: Particle | Guide

  constructor (actor: Particle | Guide) {
    const radius = actor instanceof Particle ? Particle.radius : Guide.radius
    super(actor, {
      shape: new Circle(Vec2(0, 0), radius),
      density: 1,
      friction: 0,
      restitution: 1
    })
    this.radius = radius
    this.actor = actor
    this.label = 'core'
  }
}
