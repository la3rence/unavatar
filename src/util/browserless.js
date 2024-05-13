'use strict'

const createBrowser = require('browserless')
const chromium = require('@sparticuz/chromium')
const puppeteer = require('puppeteer')
const path = require('path')
const { TMP_FOLDER } = require('../constant')

const getArgs = () => {
  const PUPPETEER_DIR = path.join(TMP_FOLDER, `puppeteer-${Date.now()}`)
  const DATA_DIR = path.join(PUPPETEER_DIR, 'profile')
  const CACHE_DIR = path.join(PUPPETEER_DIR, 'cache')

  const args = createBrowser.driver.defaultArgs.concat([
    '--allow-running-insecure-content', // https://source.chromium.org/search?q=lang:cpp+symbol:kAllowRunningInsecureContent&ss=chromium
    '--disk-cache-size=33554432', // https://source.chromium.org/search?q=lang:cpp+symbol:kDiskCacheSize&ss=chromium
    '--enable-features=SharedArrayBuffer', // https://source.chromium.org/search?q=file:content_features.cc&ss=chromium
    `--disk-cache-dir=${CACHE_DIR}`,
    `--user-data-dir=${DATA_DIR}`
  ])
  return { PUPPETEER_DIR, DATA_DIR, CACHE_DIR, args }
}

// const browser = createBrowser({
//   args: getArgs().args,
//   puppeteer
// })

chromium.setGraphicsMode = false

chromium.executablePath().then(e => {
  const browser = puppeteer.launch({
    args: getArgs().args,
    defaultViewport: chromium.defaultViewport,
    executablePath: e,
    headless: chromium.headless
  })

  browser.then(x => {
    module.exports = x
  })
})
