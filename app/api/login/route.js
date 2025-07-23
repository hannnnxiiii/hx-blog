// app/api/login/route.js
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const { username, password } = await req.json()
  const user = await prisma.user.findUnique({ where: { username } })

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  )

  const res = NextResponse.json({ message: 'Login success' })
  res.cookies.set('token', token, {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  })

  return res
}
