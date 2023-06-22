export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'SBA',
    htmlAttrs: {
      lang: 'es'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/icon-tab.png' },
      {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i'}
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/general.css',
    '@/assets/stylesheets/main.sass',
    './node_modules/element-ui/lib/theme-chalk/index.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/luxon',
    '@/plugins/uppercase',
    '@/plugins/lowercase',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
  ],

  auth: {
    strategies: {
      laravelSanctum: {
        provider: 'laravel/sanctum',
        url: process.env.NUXT_ENV_BASE_URL,
        endpoints: {
          login: { url: '/api/login', method: 'post'},
          logout: { url: '/api/logout', method: 'post' },
          user: { url: '/api/user', method: 'get' }
        }
      },
    },
    redirect:{
      login:'/acceso/administrador',
      logout:'/acceso/administrador',
      callback: false,
      home: false
    }
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    credentials: true,
    baseURL: process.env.NUXT_ENV_BASE_URL
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },
  pageTransition: {
    name: 'home',
    mode: 'out-in'
  }
}
