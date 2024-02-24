# nodejs-cli-start

Node.js Command Line start template.

## Development

### Installation dependency

```bash
pnpm i
```

### Modify command configuration

- **Step1:** Modify the command `package.json` configuration, modify `bin` to a custom command:

```json
  "bin": {
    "command-start": "bin/index.mjs"
  },
```

- **Step2:** Modify the `/ src/ index.ts` file.

### Start the development environment

```bash
pnpm dev
```

### Install commands to the global

```bash
npm link
```

### Open the command line to execute the command

## License

MIT
