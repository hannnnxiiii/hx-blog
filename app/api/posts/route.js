// app/api/posts/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(posts)
}

export async function POST(req) {
  const data = await req.json()
  const newPost = await prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
    },
  })
  return NextResponse.json(newPost)
}
