// app/api/posts/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(posts)
}

export async function POST(req) {
  const token = req.cookies.get('token')?.value
  if (!token) {
    return NextResponse.json({ error: '未授权：缺少 token' }, { status: 401 })
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    return NextResponse.json({ error: '未授权：token 无效' }, { status: 401 })
  }
  const data = await req.json()
  const newPost = await prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
    },
  })
  return NextResponse.json(newPost)
}
