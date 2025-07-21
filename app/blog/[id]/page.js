import { remark } from 'remark'
import html from 'remark-html'

export default async function PostDetail({ params }) {
  const res = await fetch(`http://localhost:3000/api/posts/${params.id}`, {
    cache: 'no-store',
  })
  const post = await res.json()

  // Markdown → HTML
  const processedContent = await remark().use(html).process(post.content)
  const contentHtml = processedContent.toString()

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        {new Date(post.createdAt).toLocaleString()}
      </p>
      <div className="prose" dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </main>
  )
}
