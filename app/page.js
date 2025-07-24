// app/page.tsx
import Link from 'next/link'
import dayjs from 'dayjs'
import getServerAuth from '@/lib/auth'

export default async function Home() {
  const res = await fetch('http://localhost:3000/api/posts', {
    cache: 'no-store',
  })
  const posts = await res.json()
  const isAuthenticated = await getServerAuth()

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">林晗曦的网络日志 ^^</h1>
      <ul className="border-t-2 border-gray-200">
        {posts.map((post) => (
          <li
            key={post.id}
            className="border-b-2 border-gray-200 hover:bg-gray-100 transition-colors flex justify-between items-center"
          >
            <Link
              href={`/blog/${post.id}`}
              className="p-2 hover:text-blue-500 transition-colors flex-1 flex justify-between items-center"
            >
              <span>{post.title}</span>
              <span>{dayjs(post.createdAt).format('YYYY-MM-DD')}</span>
            </Link>
            {isAuthenticated && (
              <Link
                href={`/admin?id=${post.id}`}
                className="flex items-center gap-1 p-2 border-l-2 border-gray-200 hover:text-blue-500 transition-colors"
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
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                  />
                </svg>
                编辑
              </Link>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}
