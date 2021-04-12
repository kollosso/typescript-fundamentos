import "reflect-metadata"
import 'dotenv/config'
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors'
import swaggerUI from 'swagger-ui-express'
import swaggerFile from '../../../swagger.json';

import createConnection from '@shared/infra/typeorm'

import '@shared/container'

import { router } from './routes';
import { AppError } from "@shared/errors/AppError";
import upload from "@config/upload";

createConnection()
const app = express();
app.use(express.json());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerFile))

app.use('/avatar', express.static(`${upload.tmpFolder}/avatar`))
app.use('/avatar', express.static(`${upload.tmpFolder}/cars`))

app.use(router);

app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      message: err.message
    })
  }

  return response.status(500).json({
    status: "error",
    message: `Internal server error - ${err.message}`
  })
})

export { app }
