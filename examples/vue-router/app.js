import { createApp, defineComponent, reactive, inject, markRaw, toRefs, h, customRef, watch, watchEffect } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import Metainfo from '../next/Metainfo.vue'
import { createMeta, useMeta } from '../next'
import About from './about.vue'

const metaUpdated = 'no'

const ChildComponent = defineComponent({
  name: 'child-component',
  props: {
    page: String
  },
  template: `
<div>
  <h3>You're looking at the <strong>{{ page }}</strong> page</h3>
  <p>Has metaInfo been updated due to navigation? {{ metaUpdated }}</p>
</div>`,
  created () {
    // console.log(this)
  },
  setup () {
    const state = reactive({
      date: null,
      metaUpdated
    })

    const metainfo = useMeta({
      charset: 'utf16',
      description: 'Description 2',
      og: {
        title: 'Og Title 2'
      }
    })

    return {
      metainfo,
      ...toRefs(state)
    }
  }
})

function view (page) {
  return {
    name: `section-${page}`,
    render () {
      return h(ChildComponent, { page })
    }
  }
}

const App = {
  setup () {
    /* const metainfo = useMeta({
      base: { href: '/vue-router', target: '_blank' },
      charset: 'utf8',
      title: 'My Title',
      description: 'The Description',
      og: {
        title: 'Og Title',
        description: 'Bla bla',
        image: [
          'https://picsum.photos/600/400/?image=80',
          'https://picsum.photos/600/400/?image=82'
        ]
      },
      twitter: {
        title: 'Twitter Title'
      },
      noscript: [
        '<!-- // A code comment -->',
        { tag: 'link', rel: 'stylesheet', href: 'style.css' }
      ],
      otherNoscript: {
        tag: 'noscript',
        'data-test': 'hello',
        content: [
          '<!-- // Another code comment -->',
          { tag: 'link', rel: 'stylesheet', href: 'style2.css' }
        ]
      },
      body: 'body-script1.js',
      script: [
        '<!--[if IE]>',
        { src: 'head-script1.js' },
        '<![endif]>',
        { src: 'body-script2.js', target: 'body' },
        { src: 'body-script3.js', target: '#put-it-here' }
      ],
      esi: {
        content: [{
          tag: 'choose',
          content: [{
            tag: 'when',
            test: '$(HTTP_COOKIE{group})=="Advanced"',
            content: [{
              tag: 'include',
              src: 'http://www.example.com/advanced.html'
            }]
          }]
        }]
      }
    })

    setTimeout(() => (metainfo.title = 'My Updated Title'), 2000) */

    const meta = useMeta({
      charset: 'utf8',
      title: 'Title 1',
      og: {
        title: 'Og Title 1'
      }
    })

    setTimeout(() => (meta.charset = 'utf17'), 2000)
    setTimeout(() => (meta.og = { title: 'Updated Og Title 1' }), 3000) // TODO: fix

    const metainfo = inject('metainfo')

    watch(metainfo, (newValue, oldValue) => {
      console.log('UPDATE', newValue)
    })

    return {
      metainfo
    }
  },
  template: `
    <metainfo :metainfo="metainfo">
      <template v-slot:base="{ content, metainfo }">http://nuxt.dev:3000{{ content }}</template>
      <template v-slot:title="{ content, metainfo }">{{ content }} - {{ metainfo.description }} - Hello</template>
      <template v-slot:og(title)="{ content, metainfo, og }">
        {{ content }} - {{ og.description }} - {{ metainfo.description }} - Hello Again
      </template>
    </metainfo>

    <div id="app">
      <h1>vue-router</h1>
      <router-link to="/">Home</router-link>
      <!-- router-link to="/about">About</router-link -->
      <transition name="page" mode="out-in">
        <router-view></router-view>
      </transition>
      <p>Inspect Element to see the meta info</p>
    </div>
  `
}

function decisionMaker5000000 (options) {
  let theChosenOne

  for (const option of options) {
    if (!theChosenOne || theChosenOne.vm.id < option.vm.id) {
      theChosenOne = option
    }
  }

  console.log(theChosenOne.value)
  return theChosenOne.value
}

const meta = createMeta({
  resolver: decisionMaker5000000,
  config: {
    esi: {
      group: true,
      namespaced: true,
      contentAttributes: [
        'src',
        'test',
        'text'
      ]
    }
  }
})

const router = createRouter({
  history: createWebHistory('/vue-router'),
  routes: [
    { name: 'home', path: '/', component: view('home') },
    { name: 'about', path: '/about', component: About }
  ]
})

const app = createApp(App)
app.component('metainfo', Metainfo)
app.use(router)
app.use(meta)
app.mount('#app')

// old stuff:
/*
const { set, remove } = app.$meta().addApp('custom')

set({
  bodyAttrs: {
    class: 'custom-app'
  },
  meta: [
    { charset: 'utf=8' }
  ]
})
setTimeout(() => remove(), 3000)
*/
/*
const waitFor = time => new Promise(r => setTimeout(r, time || 1000))
const o = {
  meta: [{ a: 1 }]
}
const ob = Vue.observable(o)

const root = new Vue({
  beforeCreate() {
    this.meta = ob.meta

    this.$options.computed = this.$options.computed || {}
    this.$options.computed['$ob'] = () => {
      return { meta: this.meta }
    }
  },
  created() {
    console.log('HERE')
    this.$watch('$ob', (a, b) => {
      console.log('WATCHER', this.$ob.meta[0].a, a.meta[0].a, b.meta[0].a, diff(a, b))
    }, { deep: true })
  },
  render(h) {
    return h('div', null, 'test')
  }
})

async function main () {
  root.$mount('#app')
  console.log(root)
  await waitFor(500)

  root.meta[0].a = 2
  await waitFor(100)

  ob.meta[0].a = 3
  await waitFor(100)
}
main()
/**/
