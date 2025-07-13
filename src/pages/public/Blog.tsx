import React from 'react';
import { Card } from '../../components/ui/card';

// Dummy data for demonstration
const blogPosts = [
  {
    id: 1,
    title: 'The Importance of Blood Donation',
    summary: 'Learn why donating blood is crucial and how it saves lives.',
    content: 'Full article content goes here... Blood donation is a vital process that helps save millions of lives every year. By donating blood, you can help patients suffering from various illnesses and injuries.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    title: 'How to Prepare for Your First Blood Donation',
    summary: 'Tips and advice for first-time blood donors.',
    content: 'Full article content goes here... Preparing for your first blood donation can be easy and stress-free. Make sure to eat a healthy meal, stay hydrated, and get plenty of rest the night before.',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80'
  }
];

const Blog: React.FC = () => {
  const [selectedPost, setSelectedPost] = React.useState<number | null>(null);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-red-700 drop-shadow">Blog</h1>
      {selectedPost === null ? (
        <div className="grid gap-8 sm:grid-cols-3">
          {blogPosts.map(post => (
            <Card
              key={post.id}
              className="p-0 cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow-lg border-0 bg-white rounded-xl overflow-hidden"
              onClick={() => setSelectedPost(post.id)}
            >
              <img src={post.image} alt={post.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2 text-gray-800">{post.title}</h2>
                <p className="text-gray-600 mb-2">{post.summary}</p>
                <span className="inline-block text-xs text-red-500 font-semibold">Read more &rarr;</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="animate-fade-in">
          <button
            className="mb-6 text-blue-600 hover:underline flex items-center gap-1"
            onClick={() => setSelectedPost(null)}
          >
            <span className="text-lg">&larr;</span> Back to Blog List
          </button>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <img
              src={blogPosts.find(p => p.id === selectedPost)?.image}
              alt={blogPosts.find(p => p.id === selectedPost)?.title}
              className="w-full h-56 object-cover"
            />
            <div className="p-6">
              <h2 className="text-3xl font-extrabold mb-4 text-gray-900">{blogPosts.find(p => p.id === selectedPost)?.title}</h2>
              <p className="text-gray-700 leading-relaxed text-lg">{blogPosts.find(p => p.id === selectedPost)?.content}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog; 