# Project and Team Collaboration Management System

Frontend prototype (Semantic HTML5 + CSS3 + Vanilla JS) — B.Tech CSE 3rd Year, GLA University.

**Team:** Yashika Agrawal, Vishal, Vivek Prasad
**Supervisor:** Yash Singh
**Repo:** https://github.com/yashika-agrawal-06/Project-and-Team-Collaboration-Management-System_ProjectBL

## Folder Structure

```
/pages
  index.html        - Login/landing (Yashika)
  dashboard.html     - Main overview (Vishal)
  kanban.html        - Task board (Vivek)
  settings.html      - (future)
/css
  global.css         - CSS variables, base reset (Yashika)
  navbar.css          - Header/sidebar (Vishal)
  buttons.css         - Button variants (Vivek)
  forms.css           - Form + kanban layout (Vivek)
/js
  modal.js             - (future)
  validation.js        - (future)
  kanban-interactions.js - (future)
/assets
  icons, logos, placeholder images
```

## This Milestone (~30%)

- Global design system (CSS variables, typography, reset)
- 3 static pages: login, dashboard, kanban board
- Responsive navbar + sidebar + card/grid layouts
- JS interactivity is a later phase — not part of this milestone.

## Branching Workflow

- `main` — stable, presentation-ready
- `dev` — integration branch, all features merge here first
- `feature/<name>-<task>` — one per member/task

**Flow:** feature branch → PR into `dev` → (after all merged) one PR `dev` → `main`.
Never commit directly to `main` or `dev`.

## Setup (first time, each member)

```bash
git clone https://github.com/yashika-agrawal-06/Project-and-Team-Collaboration-Management-System_ProjectBL.git
cd Project-and-Team-Collaboration-Management-System_ProjectBL
git checkout -b dev origin/dev      # if dev doesn't exist locally
```

See each member's own `.md` file for their exact branch name, files, and commands.