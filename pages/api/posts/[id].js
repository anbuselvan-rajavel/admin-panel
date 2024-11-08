// pages/api/posts/[id].js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query; // Extract ID from URL

  if (req.method === 'PUT') {
    // Update a specific post by ID
    const { name, role, company, joinDate, salary } = req.body;

    try {
      const updatedPost = await prisma.post.update({
        where: { id: parseInt(id) }, // Ensure the ID is an integer
        data: {
          name,
          role,
          company,
          joinDate: new Date(joinDate), // Ensure joinDate is in Date format
          salary,
        },
      });
      return res.status(200).json(updatedPost);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update post' });
    }
  } else if (req.method === 'GET') {
    // Fetch a specific post by ID
    try {
      const post = await prisma.post.findUnique({
        where: { id: parseInt(id) },
      });

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      return res.status(200).json(post);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch post' });
    }
  } else if (req.method === 'DELETE') {
    // Delete a specific post by ID
    try {
      await prisma.post.delete({
        where: { id: parseInt(id) },
      });
      return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete post' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' }); // Method not allowed for other HTTP methods
  }
}
