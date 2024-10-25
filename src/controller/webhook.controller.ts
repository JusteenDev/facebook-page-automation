import { Request, Response } from "express";
import { VERIFY_TOKEN } from '../handler/credential.handler.ts'
import { Message, Postback } from '../handler/main.handler.ts'



class WebhookController {
  constructor() {}

  async webhook(req: Request, res: Response) {
    try {
      const mode = req.query['hub.mode']
      const token = req.query['hub.verify_token']
      const challenge = req.query['hub.challenge']

      if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
          console.log('WEBHOOK_VERIFIED');
          res.status(200).send(challenge);
        } else {
          res.sendStatus(403);
        }
      }
      
    } catch (error) {
      res.status(500).json({
        error: "Something went wrong"
      })
      
      console.log('webhook error:',error.code)
    }
  }
  
  
  async handleWebhook(req: Request, res: Response) {
    try {
      const body = req.body;

      if (body.object === 'page') {
        body.entry.forEach(entry => {
          entry.messaging.forEach(event => {
            if (event.message) {
              Message(event);
            } else if (event.postback) {
              Postback(event);
            }
          });
        });

        res.status(200).send('EVENT_RECEIVED');
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      res.status(500).json({
        error: "Something went wrong"
      })
      
      console.log('webhook error:', error.code)
    }
  }
}

export default new WebhookController();