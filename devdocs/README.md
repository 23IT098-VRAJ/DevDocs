# devdocs

A new Flutter project.

## Run On Phone Via Hotspot (No USB, No ngrok)

Use this when your phone is on mobile data and shares internet through hotspot.

1. Turn on hotspot on the phone and connect the laptop to it.
2. Start backend on laptop:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

3. Allow inbound TCP `8000` in Windows Firewall (active network profile).
4. Find laptop hotspot IP with `ipconfig`.
5. In VS Code, Run and Debug has these profiles in `.vscode/launch.json`:
	- `Flutter: Phone Hotspot (local hostname)`
	- `Flutter: Phone Hotspot (set current laptop IP)`
	- `Flutter: Full API URL override`
6. If using IP, update `192.168.137.1` in the selected launch profile once, then run that profile.

For a stable setup across IP changes, use a hostname (for example via local DNS or Tailscale MagicDNS), then keep using the hostname profile.

## Automated Script (No USB)

Use `scripts/run-phone-wireless.ps1` to pair/connect ADB wirelessly and run Flutter with the correct backend define.

Example first run (pair + connect + run):

```powershell
./scripts/run-phone-wireless.ps1 `
	-PairEndpoint 192.168.137.10:37281 `
	-PairCode 123456 `
	-ConnectEndpoint 192.168.137.10:40665
```

Example next runs (skip pairing, just connect + run):

```powershell
./scripts/run-phone-wireless.ps1 `
	-SkipPair `
	-ConnectEndpoint 192.168.137.10:40665
```

Optional flags:

- `-BackendHost 192.168.137.23` to force backend host.
- `-UseApiBaseUrl` to pass full `API_BASE_URL` instead of `API_LOCAL_HOST`.

Backend must already be running on laptop:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```
