import { remark } from 'remark'
import Link from 'next/link'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'

export default async function PostDetail({ params }) {
  const res = await fetch(`http://localhost:3000/api/posts/${params.id}`, {
    cache: 'no-store',
  })
  const post = await res.json()

  // Markdown → HTML
  const processedContent = await remark()
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(post.content)
  const contentHtml = processedContent.toString()

  return (
    <main className="max-w-5xl mx-auto p-6">
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
      <h1 className="text-4xl font-bold my-2">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        {new Date(post.createdAt).toLocaleString()}
      </p>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </main>
  )
}
