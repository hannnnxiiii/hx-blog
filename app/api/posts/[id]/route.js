// app/api/posts/[id]/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(_, { params }) {
  const post = await prisma.post.findUnique({
    where: { id: Number(params.id) },
  })
  return NextResponse.json(post)
}
