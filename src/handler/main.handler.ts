import Command from "./command.handler.ts"
import {quickReplyPayload} from "./qr.handler.ts"

export async function Message(event: object) {
  const cmd = new Command()

  const result = event.message.quick_reply

  quickReplyPayload(result, event , (err) => {
    if(err) return console.error(err)
  })

  cmd.commandEvent(event, (cmd, err) => {
    if (err) {
      if (err.code == ! 'ERR_MODULE_NOT_FOUND' || 'MODULE_NOT_FOUND') { }
      else if (err.code === 'ERR_MODULE_NOT_FOUND' || 'MODULE_NOT_FOUND') { console.error(err) }
    }
  })
}

export default function Postback(event: object) {
  console.log(event)
}