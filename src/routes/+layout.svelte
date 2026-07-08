<script lang="ts">
  import '$lib/styles/global.css';
  import { ModeWatcher, mode } from 'mode-watcher';
  import { Toaster } from 'svelte-sileo';

  let { children } = $props();
</script>

<ModeWatcher />
{@render children()}
<Toaster
  position="bottom-center"
  options={{
    fill: mode.current === 'dark' ? '#f3f5fa' : '#242424',
    styles: {
      title: mode.current === 'dark' ? 'text-black!' : 'text-white!',
      description: mode.current === 'dark' ? 'text-black/85!' : 'text-white/85!',
      badge: mode.current === 'dark' ? 'bg-black/12!' : 'bg-white/12!',
      button:
        mode.current === 'dark'
          ? 'bg-black/12! text-black! hover:bg-black/20!'
          : 'bg-white/12! text-white! hover:bg-white/20!'
    }
  }}
/>
