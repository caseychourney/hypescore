import { prisma } from '../../../../lib/prisma';

export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
  try{
    const movie=await prisma.movie.findFirst({where:{OR:[{id:String(req.query.id)},{slug:String(req.query.id)}]}});
    if(!movie) return res.status(404).json({error:'Movie not found'});
    const events=await prisma.hypeEvent.findMany({where:{movieId:movie.id,moderation:'APPROVED'},orderBy:{occurredAt:'desc'},take:50});
    return res.status(200).json({events});
  }catch(error){return res.status(500).json({error:'Unable to load timeline'});}
}
