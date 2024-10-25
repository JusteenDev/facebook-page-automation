import axios from 'axios';
import fs from 'fs';
import path from 'path';
import api from '../handler/api.handler.ts'; // Adjust the import path as necessary

export const config = {
  name: 'help',
  description: 'Sends all available commands in this bot and displays page information.',
  usage: 'help',
  category: 'General',
  creator: 'libyzxy0'
};

export async function execute({ event }) {
  // const api = new Api();

  try {
    // 1. Get the list of available commands
    const commandsDir = path.join(new URL('../command', import.meta.url).pathname);
    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.ts'));

    // Fetch cool fonts and create the help entries for each command
    const commands = await Promise.all(commandFiles.map(async (file) => {
      const command = await import(path.join(commandsDir, file));
      
      console.log(command.config)
      // Get custom font for each command name from the font API
      const fontResponse = await axios.get(`https://joshweb.click/api/font?q=${encodeURIComponent(command.config.name.toUpperCase())}`);
      const fontResult = fontResponse.data[10]?.result || command.config.name.toUpperCase();

      return `${fontResult}\n   📄 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${command.config.description}\n   📝 𝗨𝘀𝗮𝗴𝗲: ${command.config.usage}\n   🏷️ 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: ${command.config.category}\n   👤 𝗖𝗿𝗲𝗮𝘁𝗼𝗿: ${command.config.creator}`;
    }));

    const totalCommands = commandFiles.length;

    // 2. Combine everything into the final message
    const helpMessage = `
    𝗝𝘂𝘀𝘁𝗲𝗲𝗻𝗗𝗲𝘃 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀:
    𝙷𝚎𝚛𝚎 𝚊𝚛𝚎 𝚝𝚑𝚎 ${totalCommands} 𝚊𝚠𝚎𝚜𝗼𝗺𝚎 𝚌𝚘𝗺𝗺𝗮𝗻𝗱𝚜 𝚝𝚑𝚊𝚝 𝚢𝚘𝚞 𝚌𝚊𝚗 𝚞𝚜𝗲 𝚠𝚒𝚝𝗁 𝗝𝘂𝘀𝘁𝗲𝗲𝗻𝗗𝗲𝘃:\n\n${commands.join('\n\n')}`;

    // 3. Send the final help message
    await api.sendMessage({ text: helpMessage }, event.sender.id)
      .then(data => {
        // console.log('Help message sent successfully:', data);
      })
      .catch(err => {
        console.error('Error sending help message:', err);
      });

  } catch (error) {
    console.error(`Error processing help command: ${error}`);
  }
}