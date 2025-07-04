import React from 'react';
import { Card } from '../../components/ui/card';

// Dummy data for demonstration
const blogPosts = [
  {
    id: 1,
    title: 'The Importance of Blood Donation',
    summary: 'Learn why donating blood is crucial and how it saves lives.',
    content: 'Full article content goes here...'
  },
  {
    id: 2,
    title: 'How to Prepare for Your First Blood Donation',
    summary: 'Tips and advice for first-time blood donors.',
    content: 'Full article content goes here...'
  }
];

const Blog: React.FC = () => {
  const [selectedPost, setSelectedPost] = React.useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      {selectedPost === null ? (
        <div className="space-y-4">
          {blogPosts.map(post => (
            <Card key={post.id} className="p-4 cursor-pointer hover:bg-gray-50" onClick={() => setSelectedPost(post.id)}>
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-600">{post.summary}</p>
            </Card>
          ))}
        </div>
      ) : (
        <div>
          <button className="mb-4 text-blue-500" onClick={() => setSelectedPost(null)}>&larr; Back to Blog List</button>
          <h2 className="text-2xl font-bold mb-2">{blogPosts.find(p => p.id === selectedPost)?.title}</h2>
          <p>{blogPosts.find(p => p.id === selectedPost)?.content}</p>
        </div>
      )}
    </div>
  );
};

export default Blog; 