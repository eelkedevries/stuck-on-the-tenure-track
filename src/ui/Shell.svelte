<script lang="ts">
  // Mobile-first responsive pixel-art app shell (specification §5). Provides the
  // header, a focusable main region (with a skip link for keyboard users), and a
  // footer. Specific screens (`055`–`059`) render into the `children` slot; this
  // shell implements no gameplay.
  import type { Snippet } from 'svelte';

  interface Props {
    title?: string;
    children?: Snippet;
  }

  let { title = 'Stuck on the Tenure Track', children }: Props = $props();
</script>

<a class="skip-link" href="#main-content">Skip to main content</a>

<div class="app-shell">
  <header class="app-header">
    <h1 class="app-title">{title}</h1>
  </header>

  <main id="main-content" class="app-main" tabindex="-1">
    {@render children?.()}
  </main>

  <footer class="app-footer">
    <p>Beta · Psychology · British English</p>
  </footer>
</div>

<style>
  .app-shell {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    max-width: 48rem;
    margin: 0 auto;
    background: var(--surface);
    border-inline: 2px solid var(--border);
  }

  .app-header {
    padding: 0.75rem 1rem;
    border-bottom: 2px solid var(--border);
  }

  .app-title {
    margin: 0;
    font-size: 1.25rem;
  }

  .app-main {
    flex: 1;
    padding: 1rem;
  }

  /* The main region is focused via the skip link; the global focus style is
     suppressed here because the heading provides the visible landmark. */
  .app-main:focus {
    outline: none;
  }

  .app-footer {
    padding: 0.5rem 1rem;
    border-top: 2px solid var(--border);
    font-size: 0.8rem;
    color: var(--muted);
  }

  .skip-link {
    position: absolute;
    left: -999px;
    top: 0;
    z-index: 10;
    padding: 0.5rem 1rem;
    background: var(--accent);
    color: var(--accent-text);
  }

  .skip-link:focus {
    left: 0;
  }

  /* Desktop refinements; base styles target mobile first. */
  @media (min-width: 48rem) {
    .app-main {
      padding: 1.5rem;
    }
    .app-title {
      font-size: 1.5rem;
    }
  }
</style>
