const { withPlausibleProxy } = require('next-plausible')


module.exports = withPlausibleProxy()({
  reactStrictMode: true,
  images: {
    domains: ["the-stack-report.ams3.digitaloceanspaces.com", "the-stack-report.ams3.cdn.digitaloceanspaces.com"]
  }
})
