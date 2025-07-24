import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(_, { params }) {
  const post = await prisma.post.findUnique({
    where: { id: Number(params.id) },
  })
  return NextResponse.json(post)
}

export async function PUT(req, { params }) {
  const body = await req.json()
  const post = await prisma.post.update({
    where: { id: Number(params.id) },
    data: {
      title: body.title,
      content: body.content,
    },
  })
  return NextResponse.json(post)
}
