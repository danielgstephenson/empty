import { Settings, Vec2, World, Body } from 'planck'
import { Config } from './config'
import { getIo } from './server'
import { Player } from './player'
import { InputSummary } from './summaries/inputSummary'
import { GameSummary } from './summaries/gameSummary'
import { Actor } from './actors/actor'
import { Particle } from './actors/particle'
import { PlayerSummary } from './summaries/playerSummary'
import { angleToDir, choose, range, shuffle } from './math'
import { Runner } from './runner'
import { Arena } from './actors/arena'
import { Collider } from './collider'
import { Guide } from './actors/guide'

export type Team = 1 | 2

export class Game {
  world = new World()
  config = new Config()
  actors = new Map<string, Actor>()
  particles = new Map<string, Particle>()
  guides = new Map<string, Guide>()
  players = new Map<string, Player>()
  runner = new Runner(this)
  collider = new Collider(this)
  summary = new GameSummary(this)
  arena = new Arena(this)
  particleCount = 5
  timeScale: number

  spawnPoints = {
    1: Vec2(0, 0),
    2: Vec2(0, 0)
  }

  scores = {
    1: 0,
    2: 0
  }

  constructor () {
    console.log('Start Game')
    Settings.velocityThreshold = 0
    this.timeScale = this.config.timeScale
    this.createParticles()
    this.reset()
    const io = getIo(this.config)
    io.on('connection', socket => {
      socket.emit('connected')
      console.log('connect:', socket.id)
      const player = new Player(this, socket.id, this.getSmallPlayerTeam())
      socket.on('input', (input: InputSummary) => {
        const moveDir = input.moveDir ?? Vec2(0, 0)
        if (player.guide != null) {
          player.guide.moveDir.x = moveDir.x ?? 0
          player.guide.moveDir.y = moveDir.y ?? 0
        }
        const summary = new PlayerSummary(player)
        socket.emit('summary', summary)
      })
      socket.on('join', () => {
        if (!player.joined) {
          console.log('join:', socket.id)
          player.join()
        }
      })
      socket.on('disconnect', () => {
        console.log('remove player:', socket.id)
        player.remove()
      })
    })
  }

  createParticles (): void {
    const teams: Team[] = [1, 2]
    teams.forEach(team => {
      range(1, this.particleCount).forEach(i => {
        const particle = new Particle(this, team, 0, 0)
        if (i % 2 === 0) particle.full = true
      })
    })
  }

  reset (): void {
    const particles = [...this.particles.values()]
    const guides = [...this.guides.values()]
    const spin1 = 2 * Math.PI * Math.random()
    const spin2 = spin1 + Math.PI
    const spread = 3 + 10 * Math.random()
    this.spawnPoints[1] = Vec2(spread * Math.cos(spin1), spread * Math.sin(spin1))
    this.spawnPoints[2] = Vec2(spread * Math.cos(spin2), spread * Math.sin(spin2))
    guides.forEach(guide => {
      guide.body.setPosition(this.spawnPoints[guide.team])
      guide.body.setLinearVelocity(Vec2(0, 0))
    })
    const particles1 = particles.filter(particle => particle.team === 1)
    const particles2 = particles.filter(particle => particle.team === 2)
    const fills = shuffle(range(1, this.particleCount).map(i => i % 2 === 0))
    range(0, this.particleCount - 1).forEach(i => {
      const flip = Math.random() < 0.5
      const start1 = flip ? spin2 : spin1
      const start2 = flip ? spin1 : spin2
      const angle1 = start1 + Math.PI * (i + 1) / 6
      const angle2 = start2 + Math.PI * (i + 1) / 6
      const spread = 3 + 10 * Math.random()
      particles1[i].full = fills[i]
      particles2[i].full = fills[i]
      particles1[i].body.setPosition(Vec2.mul(spread, angleToDir(angle1)))
      particles2[i].body.setPosition(Vec2.mul(spread, angleToDir(angle2)))
      const moveAngle = 2 * Math.PI * Math.random()
      const speed = 2
      particles1[i].body.setLinearVelocity(Vec2.mul(speed, angleToDir(angle1 + moveAngle)))
      particles2[i].body.setLinearVelocity(Vec2.mul(speed, angleToDir(angle2 + moveAngle)))
    })
  }

  checkVictory (): void {
    const particles = [...this.particles.values()]
    const emptyParticles = particles.filter(particle => !particle.full)
    const emptyParticles1 = emptyParticles.filter(particle => particle.team === 1)
    const emptyParticles2 = emptyParticles.filter(particle => particle.team === 2)
    const emptyCount1 = emptyParticles1.length
    const emptyCount2 = emptyParticles2.length
    if (emptyCount1 === this.particleCount) {
      this.scores[1] += 1
      this.reset()
    }
    if (emptyCount2 === this.particleCount) {
      this.scores[2] += 1
      this.reset()
    }
  }

  preStep (): void {
    this.getBodies().forEach(body => {
      const actor = body.getUserData() as Actor
      if (actor.removed) {
        this.world.destroyBody(body)
      }
    })
  }

  getSmallPlayerTeam (): Team {
    const count1 = this.getTeamPlayerCount(1)
    const count2 = this.getTeamPlayerCount(2)
    if (count1 === count2) return choose([1, 2])
    return count2 > count1 ? 1 : 2
  }

  getTeamPlayerCount (team: number): number {
    let count = 0
    this.guides.forEach(guide => {
      if (guide.team === team) count += 1
    })
    return count
  }

  getBodies (): Body[] {
    const bodies: Body[] = []
    for (let body = this.world.getBodyList(); body != null; body = body.getNext()) {
      bodies.push(body)
    }
    return bodies
  }
}
