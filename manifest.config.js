import { defineManifest } from '@crxjs/vite-plugin'
import pkg from './package.json'

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  icons: {
    48: 'public/logo-48.png',
    128: 'public/logo-128.png',
  },
  background:{
    "service_worker": "src/background/background.js",
  },
  permissions: [
    'storage',
    'tabs'
  ],
  web_accessible_resources: [
  {
    "resources": ["blocked.html", "lebron.png"],
    "matches": ["<all_urls>"]
  }
  ],
  action: {
    default_icon: {
      48: 'public/logo-48.png',
    },
    default_popup: 'src/popup/index.html',
  },
  
})
