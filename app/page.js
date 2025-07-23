// app/page.tsx
import Link from 'next/link'
import dayjs from 'dayjs'

export default async function Home() {
  const res = await fetch('http://localhost:3000/api/posts', {
    cache: 'no-store',
  })
  const posts = await res.json()

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">林晗曦的网络日志 ^^</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="border-b-2 border-gray-200">
            <Link
              href={`/blog/${post.id}`}
              className="p-2 hover:bg-gray-100 transition-colors flex justify-between items-center"
            >
              <span>{post.title}</span>
              <span>{dayjs(post.createdAt).format('YYYY-MM-DD')}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
