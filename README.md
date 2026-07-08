# Cucalimguística — portal static prototype v2

This is the second static prototype for the Cucalimguística / C#Linguistics portal.

## Files

- `index.html` — page structure.
- `style.css` — layout, typography, colors, responsive behavior.
- `script.js` — alternating motto and fake counter.
- `server.py` — optional no-cache local server for mobile testing.
- `assets/logo-cucalimguistica.png` — temporary logo image. Replace it with `titulov2` if needed, keeping the same filename, or update the image path in `index.html`.

## How to test locally on Windows

### Option 1: open directly

1. Unzip the folder.
2. Double-click `index.html`.

### Option 2: use local server

Open PowerShell inside the folder and run:

```bash
py -m http.server 8000 --bind 0.0.0.0
```

Then open:

```text
http://localhost:8000
```

### Option 3: use no-cache local server

Open PowerShell inside the folder and run:

```bash
py server.py
```

Then open:

```text
http://localhost:8000
```

On a phone connected to the same Wi-Fi, use your computer IPv4 address, for example:

```text
http://192.168.86.248:8000
```

## What to edit first

In `index.html`, replace `href="#"` in the three buttons with the real links.

Search for:

- `aria-label="entrar em cucagrafia"`
- `aria-label="entrar no jerador de transiginos"`
- `aria-label="entrar em cucalimguistica"`

Then replace each `href="#"` with the correct URL.
