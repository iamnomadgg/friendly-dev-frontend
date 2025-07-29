import { useState } from 'react';
import type { Route } from './+types/index';
import PostCard from '~/components/PostCard';
import Pagination from '~/components/Pagination';
import type { PostMeta } from '~/types';

export async function loader({
  request,
}: Route.LoaderArgs): Promise<{ posts: PostMeta[] }> {
  const url = new URL('/posts-meta.json', request.url);
  const res = await fetch(url.href);

  if (!res.ok) throw new Error('Failed to fetch data');

  const data = await res.json();

  return { posts: data };
}

const BlogPage = ({ loaderData }: Route.ComponentProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { posts } = loaderData;
  //Calculate total pages
  const postsPerPage = 10;
  const totalPages = Math.ceil(posts.length / postsPerPage);

  //Get current page's projects
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentPosts = posts.slice(indexOfFirst, indexOfLast);

  return (
    <div className="max-w-3xl mx-auto mt-10 px-6 py-6 bg-gray-900">
      <h2 className="text-3xl text-white font-bold mb-8">Blog</h2>
      {currentPosts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default BlogPage;
