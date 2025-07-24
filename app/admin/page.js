'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

export default function AdminPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const editorRef = useRef(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const postId = searchParams.get('id') // 获取参数 id

  // 👇 获取旧数据（用于编辑模式）
  useEffect(() => {
    if (postId) {
      fetch(`/api/posts/${postId}`)
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title)
          setContent(data.content)
        })
    }
  }, [postId])

  // 粘贴图片
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

  const insertAtCursor = (text) => {
    const textarea = document.querySelector('.w-md-editor-text-input')
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const before = content.substring(0, start)
    const after = content.substring(end)
    const newContent = before + text + after

    setContent(newContent)

    requestAnimationFrame(() => {
      textarea.focus()
      textarea.selectionStart = textarea.selectionEnd = start + text.length
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const method = postId ? 'PUT' : 'POST'
    const url = postId ? `/api/posts/${postId}` : '/api/posts'

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    })

    router.push('/')
  }

  return (
    <main className="max-w-5xl mx-auto p-4">
      <Link
        href="/"
        className="text-blue-600 flex gap-1 items-center hover:underline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
        返回首页
      </Link>
      <h1 className="text-xl font-bold my-4">
        {postId ? '编辑文章' : '添加新文章'}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="文章标题"
          className="border px-2 py-1 rounded"
          required
        />
        <div ref={editorRef}>
          <MDEditor
            value={content}
            onChange={(val = '') => setContent(val)}
            preview="live"
            height={'80vh'}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {postId ? '保存修改' : '发布文章'}
        </button>
      </form>
    </main>
  )
}
