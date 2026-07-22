import express from 'express';
import cors from 'cors';
import { ZodError } from 'zod';
import { api } from './routes/api.js';

export const app=express();
app.use(cors()); app.use(express.json()); app.use('/api',api);
app.use((err:unknown,_req:express.Request,res:express.Response,_next:express.NextFunction) => {
  if (err instanceof ZodError) return res.status(400).json({error:'Dados inválidos',details:err.flatten()});
  console.error(err); return res.status(500).json({error:'Erro interno'});
});
