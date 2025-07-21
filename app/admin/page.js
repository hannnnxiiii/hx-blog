'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

// 动态导入 Markdown 编辑器（避免 SSR 报错）
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

export default function AdminPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const editorRef = useRef(null)
  const router = useRouter()

  // 🔁 粘贴图片监听逻辑
  useEffect(() => {
    const handler = async (e) => {
      if (!e.clipboardData) return
      const items = e.clipboardData.items

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) {
            const url = await uploadImage(file)
            insertAtCursor(`![image](${url})`)
          }
        }
      }
    }

    const container = editorRef.current
    container?.addEventListener('paste', handler)

    return () => {
      container?.removeEventListener('paste', handler)
    }
  }, [content])

  // 📤 上传图片
  const uploadImage = async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
    const data = await res.json()
    return data.url
  }

  // ✏️ 插入内容到当前光标处
  const insertAtCursor = (text) => {
    const textarea = document.querySelector(
      '.w-md-editor-text-input'
    )
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const before = content.substring(0, start)
    const after = content.substring(end)
    const newContent = before + text + after

    setContent(newContent)

    // 移动光标
    requestAnimationFrame(() => {
      textarea.focus()
      textarea.selectionStart = textarea.selectionEnd = start + text.length
    })
  }

  // 🔐 文章提交
  const handleSubmit = async (e) => {
    e.preventDefault()
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    })
    router.push('/')
  }

  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">添加新文章</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="文章标题"
          className="border px-2 py-1 rounded"
          required
        />
        <div ref={editorRef}>
          <MDEditor
            value={content}
            onChange={(val = '') => setContent(val)}
            preview="edit"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          发布文章
        </button>
      </form>
    </main>
  )
}
