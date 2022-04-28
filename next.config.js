const { withPlausibleProxy } = require('next-plausible')


module.exports = withPlausibleProxy()({
  reactStrictMode: true,
  images: {
    domains: ["the-stack-report.ams3.digitaloceanspaces.com", "the-stack-report.ams3.cdn.digitaloceanspaces.com"]
  },
  async redirects() {
    return [
      {
        source: "/dashboards",
        destination: '/dashboards/tezos',
        permanent: false
      },
      {
        source: "/dashboards/tezos/contracts",
        destination: '/dashboards/tezos',
        permanent: false
      }
    ]
  }
})
