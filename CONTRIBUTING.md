# Contributing

```bash
npm install
git config core.hooksPath .githooks   # once per clone: the leak check before each commit
npm test
npm run build                          # commit icons/ with the source change that made it
```

This repo is public. The pre-commit hook and CI run [gitleaks](https://github.com/gitleaks/gitleaks) with `.gitleaks.toml`, which refuses secrets and private network addresses in any commit. Examples use the documentation range `192.0.2.x`. Device addresses, logins and site names belong in the rig that uses these icons, never here.

CI checks the committed SVGs match the source, so a glyph change and its rebuilt `icons/` land together.

`@napi-rs/canvas` is pinned to the exact build in Companion's own lockfile, so the tests and PNGs rasterise the way the deck does, and Dependabot skips it. When a Companion release moves to a new build, bump it to match and rebuild `icons/`.
