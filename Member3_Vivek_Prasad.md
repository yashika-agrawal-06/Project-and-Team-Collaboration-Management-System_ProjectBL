# Member 3 — Vivek Prasad [2415001815]

**Task:** Kanban Task Board page + Button & Form component styling
**Files to create:**
- `/pages/kanban.html`
- `/css/buttons.css`
- `/css/forms.css`

---

## 1. `/pages/kanban.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Task Board | CollabHub</title>
  <link rel="stylesheet" href="../css/global.css">
  <link rel="stylesheet" href="../css/navbar.css">
  <link rel="stylesheet" href="../css/buttons.css">
  <link rel="stylesheet" href="../css/forms.css">
</head>
<body>
  <header class="navbar">
    <div class="navbar__brand">CollabHub</div>
    <nav class="navbar__nav">
      <a href="dashboard.html" class="navbar__link">Dashboard</a>
      <a href="kanban.html" class="navbar__link navbar__link--active">Task Board</a>
      <a href="settings.html" class="navbar__link">Settings</a>
    </nav>
    <button class="btn btn--primary">+ New Task</button>
  </header>

  <main class="kanban">
    <section class="kanban__column">
      <h3>To-Do</h3>
      <article class="kanban__card">Design login page</article>
      <article class="kanban__card">Set up repo structure</article>
    </section>

    <section class="kanban__column">
      <h3>In Progress</h3>
      <article class="kanban__card">Build dashboard grid</article>
    </section>

    <section class="kanban__column">
      <h3>Completed</h3>
      <article class="kanban__card">Project synopsis</article>
    </section>
  </main>

  <footer class="site-footer">
    <p>&copy; 2026 CollabHub — GLA University Project</p>
  </footer>
</body>
</html>
```

## 2. `/css/buttons.css`

```css
.btn--secondary {
  background: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.btn--secondary:hover { background: var(--color-primary); color: #fff; }

.btn--danger { background: #dc2626; color: #fff; }
.btn--danger:hover { background: #b91c1c; }
```

## 3. `/css/forms.css`

```css
.form-group { display: flex; flex-direction: column; gap: 4px; margin-bottom: var(--space-sm); }

.form-group label { font-size: 0.9rem; color: var(--color-muted); }

.form-group input,
.form-group select,
.form-group textarea {
  padding: var(--space-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-family: var(--font-body);
}

.kanban {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--space-md);
  padding: var(--space-lg);
}

.kanban__column {
  background: var(--color-surface);
  border-radius: var(--radius);
  padding: var(--space-md);
}

.kanban__card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--space-sm);
  margin-top: var(--space-sm);
  cursor: grab;
}
```

---

## Git Commands

```bash
git checkout dev
git pull origin dev
git checkout -b feature/vivek-kanban-board

# after adding the files above
git add .
git commit -m "Add kanban board page, button and form styles"
git push origin feature/vivek-kanban-board
```

Then on GitHub: open a **Pull Request** → base `dev`, compare `feature/vivek-kanban-board`.
Don't push directly to `main` — `dev` → `main` PR happens later after all features merge.
