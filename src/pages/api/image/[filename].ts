import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { filename } = req.query

  if (!filename || typeof filename !== 'string') {
    res.status(400).json({ error: 'Filename required' })
    return
  }

  // Security: prevent directory traversal
  if (filename.includes('..') || filename.includes('/')) {
    res.status(400).json({ error: 'Invalid filename' })
    return
  }

  const imagePath = path.join(
    process.cwd(),
    'posts',
    'attachments',
    filename
  )

  try {
    const imageBuffer = fs.readFileSync(imagePath)
    
    // Determine content type
    const ext = path.extname(filename).toLowerCase()
    let contentType = 'image/jpeg'
    
    if (ext === '.webp') contentType = 'image/webp'
    else if (ext === '.png') contentType = 'image/png'
    else if (ext === '.gif') contentType = 'image/gif'
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg'

    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.send(imageBuffer)
  } catch (error) {
    res.status(404).json({ error: 'Image not found' })
  }
}
