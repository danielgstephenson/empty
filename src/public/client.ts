import io from 'socket.io-client'
import { PlayerSummary } from '../summaries/playerSummary'
import { Renderer } from './renderer'
import { Input } from './input'
import { InputSummary } from '../summaries/inputSummary'

const scoreDiv1: HTMLDivElement = document.getElementById('scoreDiv1') as HTMLDivElement
const scoreDiv2: HTMLDivElement = document.getElementById('scoreDiv2') as HTMLDivElement

const socket = io()
const renderer = new Renderer()
const input = new Input(renderer)

let joined = false

let inputSummary: InputSummary = new InputSummary(input)

socket.on('connected', () => {
  console.log('connected')
  setInterval(updateServer, 1 / 60)
})

socket.on('summary', (summary: PlayerSummary) => {
  renderer.readSummary(summary)
  joined = summary.joined
  scoreDiv1.innerHTML = String(summary.game.scores[1])
  scoreDiv2.innerHTML = String(summary.game.scores[2])
})

function updateServer (): void {
  inputSummary = new InputSummary(input)
  socket.emit('input', inputSummary)
  if (input.active && !joined) {
    socket.emit('join')
  }
}
