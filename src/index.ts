import express, { Application } from "express"
import cors from "cors"
import { webhook } from './routes/webhook.route.ts'

const PORT = process.env.PORT || 3000
const app: Application = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())

//webhook route
webhook(app)

app.listen(PORT, () => {
  process.stdout.write('\x1Bc');
  console.log(`SERVER IS LISTENING ON PORT: ${PORT}`)
})