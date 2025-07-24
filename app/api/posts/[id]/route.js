import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(_, { params }) {
  params = await params
  const post = await prisma.post.findUnique({
    where: { id: Number(params.id) },
  })
  return NextResponse.json(post)
}

export async function PUT(req, { params }) {
  params = await params

  const token = req.cookies.get('token')?.value
  if (!token) {
    return NextResponse.json({ error: '未授权：缺少 token' }, { status: 401 })
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET)
  } catch (err) {
    return NextResponse.json({ error: '未授权：token 无效' }, { status: 401 })
  }
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
