<script lang="ts">
  // Simple scrollable shell for non-turn views (start, intro, events, recap, end).
  import type { Snippet } from 'svelte';

  interface Props {
    title?: string;
    children?: Snippet;
  }

  let { title = 'Stuck on the Tenure Track', children }: Props = $props();
</script>

<a class="skip-link" href="#main-content">Skip to main content</a>

<div class="game-shell">
  <header class="game-shell-head">
    <h1>{title}</h1>
  </header>

  <main id="main-content" class="game-shell-main" tabindex="-1">
    {@render children?.()}
  </main>

  <footer class="game-shell-foot">
    <p>Beta · Psychology · British English</p>
  </footer>
</div>
