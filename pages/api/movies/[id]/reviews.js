import { prisma } from '../../../../lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method === 'GET') {
    try {
      const reviews = await prisma.review.findMany({
        where:{ movieId:String(id), moderation:'APPROVED' },
        orderBy:{ createdAt:'desc' }, take:30,
        select:{ id:true, writing:true, acting:true, story:true, characters:true, visuals:true, musicSound:true, entertainment:true, overall:true, body:true, createdAt:true }
      });
      return res.status(200).json({ reviews });
    } catch (error) { return res.status(500).json({ error:'Unable to load reviews' }); }
  }
  if (req.method !== 'POST') return res.status(405).json({ error:'Method not allowed' });
  const body=req.body||{};
  const fields=['writing','acting','story','characters','visuals','musicSound','entertainment','overall'];
  if (fields.some(k => !Number.isInteger(Number(body[k])) || Number(body[k])<1 || Number(body[k])>10)) return res.status(400).json({error:'All scores must be integers from 1 to 10'});
  try {
    const userId=String(body.userId||'');
    if(!userId) return res.status(400).json({error:'userId is required until authentication is connected'});
    await prisma.user.upsert({ where:{id:userId}, update:{}, create:{id:userId} });
    const movie=await prisma.movie.findFirst({where:{OR:[{id:String(id)},{slug:String(id)}]}});
    if(!movie) return res.status(404).json({error:'Movie not found'});
    const review=await prisma.review.upsert({
      where:{userId_movieId:{userId,movieId:movie.id}},
      update:{writing:Number(body.writing),acting:Number(body.acting),story:Number(body.story),characters:Number(body.characters),visuals:Number(body.visuals),musicSound:Number(body.musicSound),entertainment:Number(body.entertainment),overall:Number(body.overall),body:String(body.body||'').slice(0,5000),moderation:'PENDING'},
      create:{userId,movieId:movie.id,writing:Number(body.writing),acting:Number(body.acting),story:Number(body.story),characters:Number(body.characters),visuals:Number(body.visuals),musicSound:Number(body.musicSound),entertainment:Number(body.entertainment),overall:Number(body.overall),body:String(body.body||'').slice(0,5000),moderation:'PENDING'}
    });
    return res.status(201).json({ok:true,reviewId:review.id,status:'pending'});
  } catch(error){console.error(error);return res.status(500).json({error:'Unable to save review'});}
}
