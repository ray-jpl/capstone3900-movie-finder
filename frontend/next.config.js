/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
  images: {
    domains: [
      'upload.wikimedia.org',
      'm.media-amazon.com',
    ], // hostname of the img url
  },
}
