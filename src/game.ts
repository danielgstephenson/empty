import { Vec2, World } from 'planck'
import { Config } from './config'
import { getIo } from './server'
import { Player } from './player'
import { InputSummary } from './summaries/inputSummary'
import { GameSummary } from './summaries/gameSummary'
import { Actor } from './actors/actor'
import { Particle } from './actors/particle'
import { PlayerSummary } from './summaries/playerSummary'
import { choose, range } from './math'
import { Runner } from './runner'
import { Arena } from './actors/arena'
import { Collider } from './collider'

export class Game {
  world = new World()
  config = new Config()
  actors = new Map<string, Actor>()
  particles = new Map<string, Particle>()
  players = new Map<string, Player>()
  runner = new Runner(this)
  collider = new Collider(this)
  summary = new GameSummary(this)
  arena = new Arena(this)

  timeScale: number

  constructor () {
    console.log('Start Game')
    this.timeScale = this.config.timeScale
    this.createParticles()
    const io = getIo(this.config)
    io.on('connection', socket => {
      console.log('connect:', socket.id)
      socket.emit('connected')
      const player = new Player(this, socket.id)
      socket.on('input', (input: InputSummary) => {
        const moveDir = input.moveDir ?? Vec2(0, 0)
        player.particle.moveDir.x = moveDir.x ?? 0
        player.particle.moveDir.y = moveDir.y ?? 0
        const summary = new PlayerSummary(player)
        socket.emit('summary', summary)
      })
      socket.on('click', () => {
        // console.log('click')
      })
      socket.on('disconnect', () => {
        console.log('disconnect:', socket.id)
        player.remove()
      })
    })
  }

  createParticles (): void {
    [1, 2].forEach(team => {
      range(1, 4).forEach(i => {
        const x = 0.5 * (2 * Math.random() - 1) * Arena.hx
        const y = 0.5 * (2 * Math.random() - 1) * Arena.hy
        const particle = new Particle(this, x, y)
        particle.team = team
      })
    })
  }

  preStep (): void {
    //
  }

  getSmallPlayerTeam (): number {
    const count1 = this.getTeamPlayerCount(1)
    const count2 = this.getTeamPlayerCount(2)
    if (count1 === count2) return choose([1, 2])
    return count2 > count1 ? 1 : 2
  }

  getTeamPlayerCount (team: number): number {
    let count = 0
    this.players.forEach(player => {
      if (player.particle.team === team) count += 1
    })
    return count
  }
}
