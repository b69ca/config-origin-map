# config-origin-map

Merge layered JSON configuration in precedence order and show exactly which file—or command-line override—won every final leaf.

## Run from GitHub

```sh
npx --yes github:b69ca/config-origin-map defaults.json team.json production.json
npx --yes github:b69ca/config-origin-map defaults.json production.json --set http.port=8443
npx --yes github:b69ca/config-origin-map defaults.json secrets.json --sources-only
```

The package is not currently published to npm. Install it from GitHub with `npm install --global github:b69ca/config-origin-map` if you prefer the shorter `config-origin-map` command.

Objects merge recursively; arrays and scalar values replace earlier values; `null` is an explicit value. Output uses JSON Pointer paths and includes shadowed source names. `--json` returns both the merged document and a provenance map. `--sources-only` omits values when configuration may contain secrets.

Many applications implement their own layered configuration, and a few large frameworks expose internal provenance. This tiny utility is framework-neutral: it lets maintainers reproduce and explain precedence before wiring values into an application. It intentionally reads JSON only and never reads ambient environment variables, avoiding accidental secret collection.

Zero dependencies, Node.js 20+, MIT licensed.
