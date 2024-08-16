import { Game } from './game'
import { GameSummary } from './summaries/gameSummary'

export class Runner {
  game: Game
  time: number

  constructor (game: Game) {
    this.game = game
    this.time = performance.now()
    setInterval(() => this.step(), 20)
  }

  step (): void {
    const oldTime = this.time
    this.time = performance.now()
    const dt = this.game.timeScale * (this.time - oldTime) / 1000
    this.game.preStep()
    this.game.guides.forEach(guide => guide.preStep())
    this.game.world.step(dt * this.game.config.timeScale)
    this.game.guides.forEach(guide => guide.postStep())
    this.game.summary = new GameSummary(this.game)
  }

  restart (): void {
    this.game.guides.forEach(guide => { guide.team = 0 })
    this.game.players.forEach(player => player.joinTeam())
    this.game.guides.forEach(guide => guide.respawn())
  }
}
