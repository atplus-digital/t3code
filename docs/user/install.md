# Install Platon Code

Platon Code is a web and desktop GUI for running coding agents on your machine.

## Requirements

Node.js `^22.16 || ^23.11 || >=24.10` on the machine that runs the Platon Code server.

At least one provider CLI, installed and authenticated. See [Providers](#providers) below.

## Run Without Installing

```bash
npx platon-code@latest
```

This starts the Platon Code server on your machine and opens the local web app. Use
`npx platon-code@latest --help` for the full CLI reference.

The CLI binary is still invoked as `platon` after install (`npx platon-code` runs the
`platon` bin from the `platon-code` package).

## Data directory (migrating from T3 Code)

Platon Code stores runtime state under `~/.platon` (or `PLATON_CODE_HOME`). It does **not**
automatically read `~/.t3` or `T3CODE_*` from an upstream T3 Code install. That is an intentional
hard break for this fork.

To copy an existing T3 Code database into Platon Code (with no server using the source file):

```bash
mkdir -p ~/.platon/userdata
# Prefer VACUUM INTO while a T3 server may have the source open:
#   bun -e "new (require('bun:sqlite').Database)(process.env.HOME + '/.t3/userdata/state.sqlite', { readonly: true }).run(\"VACUUM INTO '\" + process.env.HOME + \"/.platon/userdata/state.sqlite'\")"
# Or, when nothing has the source open:
cp -R ~/.t3/userdata/. ~/.platon/userdata/
# Optional: copy secrets/settings if you need the same credentials/preferences
# cp ~/.t3/secrets ~/.platon/ 2>/dev/null || true
# cp ~/.t3/settings.json ~/.platon/ 2>/dev/null || true
```

Project files are named `platon.json` (not `t3.json`). Rename per project if you still have the old file.

## Desktop App

Download the latest release from
[GitHub Releases](https://github.com/pingdotgg/platon-code/releases), or install from a package
registry.

Windows:

```bash
winget install Platon.PlatonCode
```

macOS:

```bash
brew install --cask platon-code
```

Arch Linux:

```bash
yay -S platon-code-bin
```

## Providers

Platon Code drives provider CLIs; it does not ship them. Install the CLI for each provider you want
to use, then authenticate it.

| Provider   | CLI                                                         | Default binary | Log in with           |
| ---------- | ----------------------------------------------------------- | -------------- | --------------------- |
| Codex      | [Codex CLI](https://developers.openai.com/codex/cli)        | `codex`        | `codex login`         |
| Claude     | [Claude Code](https://claude.com/product/claude-code)       | `claude`       | `claude auth login`   |
| Cursor     | [Cursor CLI](https://cursor.com/cli)                        | `cursor-agent` | `agent login`         |
| Grok Build | [Grok Build CLI](https://x.ai/cli)                          | `grok`         | `grok login`          |
| Kimi       | [Kimi Code CLI](https://moonshotai.github.io/kimi-code/en/) | `kimi`         | `kimi` then `/login`  |
| OpenCode   | [OpenCode](https://opencode.ai)                             | `opencode`     | `opencode auth login` |

Cursor is the one to watch: install Cursor CLI, which provides the `cursor-agent` binary that
Platon Code looks for, but authenticate with `agent login`, not `cursor-agent login`.

Run the login command on the machine running the Platon Code server, not on the device you browse
from.

### Binary Discovery

Each provider CLI must be on the server's `PATH`, or have an explicit binary path set in
**Settings** → the provider instance → **Binary path**. Use the explicit path when a version
manager or a non-standard install location keeps the CLI off the `PATH` of the shell that
started Platon Code.

### When Auth Is Needed

Provider auth is required before you start a session with that provider, not before you start
Platon Code. You can install Platon Code, open it, and add providers afterwards. A provider that is not
authenticated shows its status in **Settings** and fails at session start with the login command
to run.

For multi-account setups, see [Codex](./providers-codex.md) and [Claude](./providers-claude.md).

## Next Steps

- [Permission modes](./permission-modes.md): how much Platon Code asks before acting
- [Remote access](./remote-access.md): connect from a phone, tablet, or another desktop
- [Keeping Platon Code in sync](./updating.md): client and server version skew
- [Running in the background](./background-service.md): Linux background service
