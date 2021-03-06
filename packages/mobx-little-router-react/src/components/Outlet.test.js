// @flow
import React from 'react'
import { autorun } from 'mobx'
import { createRouter, delay, mountInProvider } from '../testUtil'
import Outlet from './Outlet'

describe('Outlet', () => {
  let router

  beforeEach(() => {
    router = createRouter(
      [
        {
          path: '',
          getData: () => ({ component: RootPage }),
          children: [
            { path: '', getData: () => ({ component: HomePage }) },
            {
              path: 'about',
              getData: () => ({ component: AboutPage }),
              children: [{ path: 'contact', getData: () => ({ component: ContactPage }) }]
            },
            {
              path: 'posts',
              children: [
                { path: '', getData: () => ({ component: PostListPage }) },
                { path: ':id', getData: () => ({ component: PostViewPage }) }
              ]
            }
          ]
        }
      ],
      '/'
    )
    return router.start()
  })

  afterEach(() => {
    router.stop()
  })

  test('Renders', async () => {
    const wrapper = mountInProvider(router)(<Outlet />)
    await delay(0)
    expect(wrapper.html()).toMatch(/RootPage/)
    expect(wrapper.html()).toMatch(/HomePage/)
  })

  test('Supports nested routes', async () => {
    await router.push('/about/contact')
    const wrapper = mountInProvider(router)(<Outlet />)
    expect(wrapper.html()).toMatch(/RootPage/)
    expect(wrapper.html()).toMatch(/AboutPage/)
    expect(wrapper.html()).toMatch(/ContactPage/)
  })
})

const RootPage = () => <div>RootPage<Outlet /></div>
const HomePage = () => <div>HomePage<Outlet /></div>
const AboutPage = () => <div>AboutPage<Outlet /></div>
const ContactPage = () => <div>ContactPage</div>
const PostListPage = () => <div>PostListPage</div>
const PostViewPage = () => <div>PostViewPage</div>
