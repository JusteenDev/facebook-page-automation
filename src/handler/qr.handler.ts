export async function quickReplyPayload(qr: object, event: object, callback: Function){
  async function run(command, event) {
    try {
      const { execute } = await import(`../command/${command}`);
      await execute({ event: event });
      
    } catch (error) {
      callback(error)
    }
  }
  
  if (qr) {
    switch (qr.payload) {
      case "<HELP_COMMAND>":
        const command = "help";
        run(command, event)
        break
    }
  }
}