---
name: Browser testing on Nix
description: Why browser checks should use the system-managed Chromium in this workspace.
---

Use Nix-managed Chromium for local browser testing rather than assuming Playwright's downloaded Linux browser will run.

**Why:** The downloaded headless shell could not launch because its expected shared libraries were missing on NixOS. The system-managed Chromium worked.

**How to apply:** Install Chromium through the supported system-package tooling, resolve its executable from PATH, and pass it to the browser launcher. Do not use apt or hardcode a Nix store hash.
