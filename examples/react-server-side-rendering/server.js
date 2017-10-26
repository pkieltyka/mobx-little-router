import express from 'express'
import React from 'react'
import path from 'path'
import ReactDOM from 'react-dom/server'
import { createMemoryHistory } from 'history'
import { install } from 'mobx-little-router-react'
import App from './src/App'
import routes from './src/routes'
import DataStore from './src/DataStore'

const app = express()

app.use('/dist/', express.static(path.join(__dirname, 'dist'), { maxAge: 31536000000 }))

app.get('*', (req, res) => {
  const dataStore = new DataStore()
  const ctx = {
    status: 200,
    dataStore: dataStore
  }
  const router = install({
    history: createMemoryHistory({ initialEntries: [req.url] }),
    routes,
    getContext: () => ctx
  })

  router.start(() => {
    const stream = ReactDOM.renderToNodeStream(
      <App dataStore={dataStore} router={router} />
    )

    if (ctx.status > 300 && ctx.status < 400) {
      res.redirect(ctx.status, router._store.location.pathname)
    } else {
      res.status(ctx.status)
      res.write('<!doctype html><html><body><div id="root">')
      stream.pipe(res, { end: false })
      stream.on('end', () => {
        res.write(`</div><script src="/dist/bundle.js"></script></body></html>`)
        res.end()
      })
    }
  })
})

app.listen(3000, () => {
  console.log('SSR example listening on port 3000!')
})