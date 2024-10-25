import { CustomAPIError } from './custom-error.handler.ts'
import { Request, Response } from 'express'

// add next: nextFunction if needed
const errorHandlerMiddleware = (err: Error, req: Request, res: Response) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }
  return res.status(500).json({ code: 400, msg: 'Something went wrong' })
}

export default errorHandlerMiddleware;