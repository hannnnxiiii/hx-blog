// app/admin/page.js
'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import EditorForm from './editor-form'

export default function AdminPage() {
  return (
    <main className="max-w-5xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">编辑文章</h1>
      <Suspense fallback={<p>加载中...</p>}>
        <EditorForm />
      </Suspense>
    </main>
  )
}
