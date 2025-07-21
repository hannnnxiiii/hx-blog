// app/page.tsx
import Link from 'next/link'

export default async function Home() {
  const res = await fetch('http://localhost:3000/api/posts', { cache: 'no-store' })
  const posts = await res.json()

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">我的博客</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="mb-2">
            <Link href={`/blog/${post.id}`} className="text-blue-600 underline">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
