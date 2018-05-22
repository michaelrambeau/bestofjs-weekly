import React, { Component } from 'react'
import { ServerStyleSheet } from 'styled-components'

import fetchIssues from './src/utils/fetch-and-populate'

export default {
  getSiteData: () => ({
    title: 'Best of JavaScript Weekly'
  }),
  getRoutes: async () => {
    const issues = await fetchIssues()
    const latestIssueNumber = issues[issues.length - 1].number
    return [
      {
        path: '/',
        component: 'src/pages/HomePage',
        getData: () => ({
          issues
        })
      },
      {
        path: '/issues',
        component: 'src/pages/IssueListPage',
        getData: () => ({
          issues
        }),
        children: issues.map(issue => ({
          path: `/${issue.number}`,
          component: 'src/pages/IssuePage',
          getData: () => ({
            issue,
            isLatest: issue.number === latestIssueNumber
          })
        }))
      },
      {
        is404: true,
        component: 'src/containers/404'
      }
    ]
  },
  renderToHtml: (render, Comp, meta) => {
    const sheet = new ServerStyleSheet()
    const html = render(sheet.collectStyles(<Comp />))
    meta.styleTags = sheet.getStyleElement()
    return html
  },
  Document: class CustomHtml extends Component {
    render() {
      const { Html, Head, Body, children, renderMeta } = this.props

      return (
        <Html>
          <Head>
            <meta charSet="UTF-8" />
            <title>Best of JavaScript Weekly</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            {renderMeta.styleTags}
            <link
              href="https://fonts.googleapis.com/css?family=Space+Mono:400,400i|Roboto+Slab:300,400,700"
              rel="stylesheet"
            />
          </Head>
          <Body>{children}</Body>
        </Html>
      )
    }
  }
}
