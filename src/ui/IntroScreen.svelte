<script lang="ts">
  // New-game intro / onboarding (specification §4.2, §5; prompt 085). Sets the
  // premise, the goal, and how a turn works in a few dry lines, then starts
  // play. Presentational — "Begin" is emitted to the store.
  interface Props {
    onBegin?: () => void;
  }

  let { onBegin }: Props = $props();
</script>

<section class="intro" aria-label="How to play">
  <h2>So you want tenure.</h2>

  <p>
    You are starting a psychology degree with one quietly deranged ambition: to be the
    <strong>first of your four-person cohort to win tenure</strong>. One of you will make it.
    The others will finish second, third, or leave for industry, where they will be happier
    and earn more.
  </p>

  <h3>How a term works</h3>
  <ol>
    <li><strong>Events.</strong> Things happen. Read each one and choose how to respond.</li>
    <li><strong>The campus.</strong> Go to places on the board and spend your time there — studying, teaching, researching, resting.</li>
    <li><strong>Money.</strong> Your loan lands each term and the rent goes out. Bar shifts and tutoring pay; pints and conference fees do not. Stay out of the red.</li>
    <li><strong>Deadlines.</strong> Keep an eye on what's due. Missing things has consequences.</li>
    <li><strong>End the term.</strong> You get a short diary of what happened, then time moves on (about six months a term).</li>
  </ol>

  <p class="aside">
    Mind your sleep, your mood, your bank balance, and the people who put up with you. A glittering
    CV and no life still counts as winning — technically.
  </p>

  <button type="button" class="primary" onclick={() => onBegin?.()}>Begin</button>
</section>

<style>
  .intro {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  h2 {
    margin: 0;
  }
  h3 {
    margin: 0.5rem 0 0;
    font-size: 1rem;
  }
  p {
    margin: 0;
  }
  ol {
    margin: 0;
    padding-left: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .aside {
    color: var(--muted);
    font-style: italic;
  }
  button {
    align-self: flex-start;
    font-family: inherit;
    padding: 0.5rem 1.2rem;
    border: 2px solid var(--border);
    background: var(--accent);
    color: var(--accent-text);
    cursor: pointer;
  }
</style>
