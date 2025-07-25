'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

export default function EditorForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false) // 新增状态
  const editorRef = useRef(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const postId = searchParams.get('id')

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
    return () => container?.removeEventListener('paste', handler)
  }, [])

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
    setContent((prevContent) => {
      const before = prevContent.substring(0, start)
      const after = prevContent.substring(end)
      return before + text + after
    })

    requestAnimationFrame(() => {
      textarea.focus()
      textarea.selectionStart = textarea.selectionEnd = start + text.length
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true) // 开始提交，禁用按钮

    const method = postId ? 'PUT' : 'POST'
    const url = postId ? `/api/posts/${postId}` : '/api/posts'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || '提交失败，请稍后重试')
      }

      router.push('/')
    } catch (err) {
      alert(err.message || '提交失败，请检查网络或稍后再试')
      setIsSubmitting(false) // 失败时恢复按钮可用
    }
  }

  return (
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
        disabled={isSubmitting}
        className={`px-4 py-2 rounded text-white ${
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isSubmitting ? '提交中...' : postId ? '保存修改' : '发布文章'}
      </button>
    </form>
  )
}
