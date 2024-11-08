// pages/api/posts.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Create a new post
    const { name, role, company, joinDate, salary } = req.body;

    try {
      const post = await prisma.post.create({
        data: {
          name,
          role,
          company,
          joinDate: new Date(joinDate), // Ensure joinDate is in Date format
          salary,
        },
      });
      return res.status(201).json(post);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create post' });
    }
  } else if (req.method === 'GET') {
    // Fetch all posts
    try {
      const posts = await prisma.post.findMany();
      return res.status(200).json(posts);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch posts' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' }); // Method not allowed for other HTTP methods
  }
}
