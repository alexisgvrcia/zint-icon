<script lang="ts">
  import '$lib/styles/global.css';
  import { ModeWatcher } from 'mode-watcher';
  import { Toaster } from 'svelte-sileo';

  let { children } = $props();
</script>

<ModeWatcher />
{@render children()}
<Toaster position="bottom-center" />
