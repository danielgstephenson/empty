import { Vec2, World } from 'planck'
import { Config } from './config'
import { getIo } from './server'
import { Player } from './player'
import { InputSummary } from './summaries/inputSummary'
import { GameSummary } from './summaries/gameSummary'
import { Actor } from './actors/actor'
import { Fighter } from './actors/fighter'
import { PlayerSummary } from './summaries/playerSummary'
import { choose } from './math'
import { Runner } from './runner'
import { Arena } from './actors/arena'

export class Game {
  world = new World()
  config = new Config()
  actors = new Map<string, Actor>()
  fighters = new Map<string, Fighter>()
  players = new Map<string, Player>()
  runner = new Runner(this)
  summary = new GameSummary(this)
  arena = new Arena(this)

  timeScale: number

  constructor () {
    console.log('Start Game')
    this.timeScale = this.config.timeScale
    const io = getIo(this.config)
    io.on('connection', socket => {
      console.log('connect:', socket.id)
      socket.emit('connected')
      const player = new Player(this, socket.id)
      socket.on('input', (input: InputSummary) => {
        const moveDir = input.moveDir ?? Vec2(0, 0)
        player.fighter.moveDir.x = moveDir.x ?? 0
        player.fighter.moveDir.y = moveDir.y ?? 0
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
      if (player.fighter.team === team) count += 1
    })
    return count
  }
}
