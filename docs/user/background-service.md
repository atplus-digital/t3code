# Running Platon Code in the Background

On a Linux host, Platon Code can run as a background service for your user. It starts when the machine
boots and keeps running after you log out.

## Manage the Service

Install it with the latest Platon Code release:

```sh
npx t3@latest service install
```

Check whether it is installed:

```sh
npx t3@latest service status
```

Update or repair it:

```sh
npx t3@latest service update
```

Stop it and remove it from startup:

```sh
npx t3@latest service uninstall
```

Updating restarts Platon Code briefly. Let active agent work and terminal commands finish first.

The systemd unit runs a small stable launcher. Exact Platon Code versions are installed separately, so
a failed remote candidate can return to the previous version without rewriting the unit. Releases
that change the database must be installed with the local `service update` command above.

## Using It with Platon Connect

Platon Connect may offer to install the service during setup so the host stays reachable after you log
out. This is only an onboarding shortcut: the service and Platon Connect are managed separately.

Signing out of Platon Connect does not remove the service. Use `t3 service uninstall` when you no longer
want Platon Code to start in the background.

The background service currently requires Linux with systemd.
