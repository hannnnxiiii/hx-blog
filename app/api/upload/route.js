import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req) {
  const formData = await req.formData()
  const file = formData.get('file')

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const filename = `${Date.now()}-${file.name}`
  const filepath = path.join(process.cwd(), 'public/uploads', filename)

  // 确保 uploads 目录存在
  fs.mkdirSync(path.dirname(filepath), { recursive: true })
  fs.writeFileSync(filepath, buffer)

  return NextResponse.json({ url: `/uploads/${filename}` })
}
