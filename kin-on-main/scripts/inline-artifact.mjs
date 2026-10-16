// Turns dist-artifact/ into one self-contained page body (CSS and JS inlined) for sharing as a link.
import { readFileSync, writeFileSync } from 'node:fs'

const dir = new URL('../dist-artifact/', import.meta.url)
let html = readFileSync(new URL('index.html', dir), 'utf8')

html = html.replace(/<link rel="stylesheet"[^>]*href="\.\/(assets\/[^"]+\.css)"[^>]*>/g, (_, file) =>
  `<style>${readFileSync(new URL(file, dir), 'utf8')}</style>`)
let scripts = ''
html = html.replace(/<script type="module" crossorigin src="\.\/(assets\/[^"]+\.js)"><\/script>/g, (_, file) => {
  scripts += `<script type="module">${readFileSync(new URL(file, dir), 'utf8').replace(/<\/script/g, '<\\/script')}</script>`
  return ''
})
html = html
  .replace(/<!doctype html>|<\/?html[^>]*>|<\/?head>|<\/?body>|<meta charset[^>]*>|<meta name="viewport"[^>]*>|<link rel="icon"[^>]*>/gi, '')
  .replace('<div id="root"></div>', () => `<div id="root"></div>${scripts}`)

writeFileSync(new URL('kin-on-main.html', dir), html.trim() + '\n')
console.log('Wrote dist-artifact/kin-on-main.html', Math.round(html.length / 1024) + ' KB')
