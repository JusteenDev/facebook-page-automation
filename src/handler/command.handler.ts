import axios from "axios"
import api from "./api.handler.ts"

export default class command {

  async commandEvent(event: any, callback: (command: string | null, error: Error | null) => void) {
    const senderId = event.sender.id

    if (event.message.text) {
      const text = event.message.text.toLowerCase();
      const texts = text.split(' ');
      const command = texts.shift();
      if (command && command.startsWith('/')) {
        const commandName = command.substring(1);
        try {
          callback(commandName, null);
          const { execute } = await import(`../command/${commandName}`);
          await execute({ event: event });
        } catch (error) {

            const config = [
              { content_type: "text", title: "help", payload: "<HELP_COMMAND>" }
            ]

            api.sendQuickReplies("Use /help command to available commands or click the help button below", senderId, config, (data, err) => {
              
            })

          callback(null, error);
        }
      } else {
        callback(null, new Error('Command must start with a slash.'));
      }
    } else {
      callback(null, new Error('No message text found.'));
    }
  }

}