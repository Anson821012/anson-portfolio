import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const root = new URL('../', import.meta.url);

test('home hero presents exactly two primary paths', async () => {
  const html = await readFile(new URL('index.html', root), 'utf8');
  assert.equal((html.match(/data-path-card/g) || []).length, 2);
  assert.match(html, /class="hero-path hero-path--work" href="contact\/"/);
  assert.match(html, /class="hero-path hero-path--learn" href="studio\/"/);
  assert.match(html, /找 Anson 合作/);
  assert.match(html, /行銷學 QA 闖關/);
  assert.doesNotMatch(html, /class="home-directory/);
});

test('home paths keep responsive, motion and reduced-motion support', async () => {
  const [friends, motion, script] = await Promise.all([
    readFile(new URL('friends.css', root), 'utf8'),
    readFile(new URL('motion.css', root), 'utf8'),
    readFile(new URL('motion.js', root), 'utf8')
  ]);
  assert.match(friends, /\.hero-paths\{order:3/);
  assert.match(friends, /@media\(prefers-reduced-motion:reduce\)/);
  assert.match(motion, /\.hero-art\.is-path-preview \.robot-speech/);
  assert.match(script, /querySelectorAll\('\[data-path-card\]'\)/);
  assert.match(script, /dataset\.robotMessage/);
});

test('home search description explains both routes', async () => {
  const [html, fields] = await Promise.all([
    readFile(new URL('index.html', root), 'utf8'),
    readFile(new URL('content/seo-fields.mjs', root), 'utf8')
  ]);
  for (const source of [html, fields]) {
    assert.match(source, /找 Anson/);
    assert.match(source, /六關行銷 QA 闖關/);
  }
});
