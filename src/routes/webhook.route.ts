import { Router, Application } from "express";
import webhookController from '../controller/webhook.controller.ts'

const router = Router()

router.route("/webhook").get(webhookController.webhook).post(webhookController.handleWebhook);

/* Initialize router */
export const webhook = (app: Application) =>
  app.use('/', router);