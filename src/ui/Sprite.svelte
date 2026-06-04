<script lang="ts">
  interface Props {
    id: string;
    size?: number;
    vb?: string;
    cls?: string;
  }
  let { id, size = 24, vb = '0 0 24 24', cls = '' }: Props = $props();
</script>

<svg class={'px ' + cls} width={size} height={size} viewBox={vb} aria-hidden="true">
  <use href={'#' + id} />
</svg>
