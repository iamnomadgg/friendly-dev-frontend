import { useState } from 'react';
import type { Route } from './+types/index';
import PostCard from '~/components/PostCard';
import Pagination from '~/components/Pagination';
import PostFilter from '~/components/PostFilter';
import type { Post, StrapiResponse, StrapiPost } from '~/types';

export async function loader({
  request,
}: Route.LoaderArgs): Promise<{ posts: Post[] }> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/posts?populate=image&sort=date:desc`
  );

  if (!res.ok) throw new Error('Failed to fetch data');

  const json: StrapiResponse<StrapiPost> = await res.json();

  const posts = json.data.map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    date: item.date,
    body: item.body,
    image: item.image?.url
      ? `${import.meta.env.VITE_STRAPI_URL}${item.image.url}`
      : '/images/no-image.png',
  }));

  return { posts };
}

const BlogPage = ({ loaderData }: Route.ComponentProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const { posts } = loaderData;

  //Filter projects based on the category
  const filteredPosts =
    searchQuery === ''
      ? posts
      : posts.filter(
          (post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
        );

  //Calculate total pages
  const postsPerPage = 10;
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  //Get current page's projects
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirst, indexOfLast);

  return (
    <div className="max-w-3xl mx-auto mt-10 px-6 py-6 bg-gray-900">
      <h2 className="text-3xl text-white font-bold mb-8">Blog</h2>
      <PostFilter
        searchQuery={searchQuery}
        onSearchChange={(query) => {
          setSearchQuery(query);
          setCurrentPage(1);
        }}
      />

      <div className="space-y-8">
        {currentPosts.length === 0 ? (
          <p className="text-gray-400 text-center">No posts found</p>
        ) : (
          currentPosts.map((post) => <PostCard key={post.slug} post={post} />)
        )}
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default BlogPage;
