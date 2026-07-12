<script lang="ts">
  import Header from '$lib/components/layout/header.svelte';
  import IconSelector from '$lib/components/icon/icon-selector.svelte';
  import Preview from '$lib/components/icon/preview.svelte';
  import BackgroundOptions from '$lib/components/configuration/background-options.svelte';
  import IconOptions from '$lib/components/configuration/icon-options.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import { ImageIcon, PencilIcon } from '@lucide/svelte';

  let activeAside: 'icon' | 'background' = 'icon';
</script>

<Header />

<main class="min-h-svh select-none overflow-hidden px-0 pt-16 md:px-6 md:pt-20">
  <div class="hidden h-[calc(100svh-6rem)] gap-6 md:flex">
    <aside
      class="flex h-full flex-[0_0_320px] flex-col overflow-hidden rounded-2xl border border-black/10 bg-[#f4f5fa] backdrop-blur-sm md:max-w-[270px] lg:min-w-80 dark:border-[#333] dark:bg-[#1f1f1f57]"
    >
      <div class="flex-1 space-y-4 overflow-y-auto p-3">
        <IconSelector />
        <div class="space-y-3 pt-1">
          <div class="px-1">
            <h2 class="text-sm font-medium text-gray-700 dark:text-gray-300">Icon Settings</h2>
          </div>
          <div class="bg-black/8 dark:bg-white/8 h-px"></div>
        </div>
        <IconOptions />
      </div>
    </aside>

    <section class="flex h-full flex-1 items-center justify-center overflow-hidden py-8">
      <div class="md:scale-50 lg:scale-75 xl:scale-100">
        <Preview />
      </div>
    </section>

    <aside
      class="flex h-full flex-[0_0_320px] flex-col overflow-hidden rounded-2xl border border-black/10 bg-[#f4f5fa] backdrop-blur-sm md:max-w-[270px] lg:min-w-80 dark:border-[#333] dark:bg-[#1f1f1f57]"
    >
      <div class="flex-1 space-y-4 overflow-y-auto p-3">
        <BackgroundOptions />
      </div>
    </aside>
  </div>

  <div class="flex h-[calc(100vh-5rem)] flex-col md:hidden">
    <section class="flex flex-1 items-center justify-center overflow-hidden px-4 py-8">
      <div class="scale-50 sm:scale-75">
        <Preview />
      </div>
    </section>

    <aside
      class="flex flex-1 flex-col overflow-hidden rounded-t-[24px] border border-black/10 bg-[#f4f5fa] backdrop-blur-sm dark:border-[#333] dark:bg-[#1f1f1f57]"
    >
      <div class="{activeAside === 'icon' ? 'flex' : 'hidden'} h-full flex-col overflow-hidden">
        <div class="flex-1 space-y-4 overflow-y-auto p-6">
          <IconSelector />
          <div class="space-y-3 pt-1">
            <div class="px-1">
              <h2 class="text-sm font-medium text-gray-700 dark:text-gray-300">Icon Settings</h2>
            </div>
            <div class="bg-black/8 dark:bg-white/8 h-px"></div>
          </div>
          <IconOptions />
        </div>
      </div>

      <div
        class="{activeAside === 'background' ? 'flex' : 'hidden'} h-full flex-col overflow-hidden"
      >
        <div class="flex-1 space-y-6 overflow-y-auto p-6">
          <div class="space-y-4">
            <BackgroundOptions />
          </div>
        </div>
      </div>
    </aside>

    <nav
      class="-mt-px flex gap-1.5 border-x border-t border-black/10 bg-[#f4f5fa] p-1.5 backdrop-blur-sm dark:border-[#333] dark:bg-[#1f1f1f57]"
    >
      <Button
        variant="glass"
        size="sm"
        class="flex-1 flex-col gap-0.5 py-2.5 {activeAside === 'icon'
          ? '!border-black/20 !bg-black/5 !text-black dark:!border-white/20 dark:!bg-white/10 dark:!text-white'
          : ' bg-gray-100/5'}"
        onclick={() => (activeAside = 'icon')}
      >
        <PencilIcon class="h-4 w-4" />
        <span class="text-[11px] font-medium leading-none">Icon</span>
      </Button>
      <Button
        variant="glass"
        size="sm"
        class="flex-1 flex-col gap-0.5 py-2.5 {activeAside === 'background'
          ? '!border-black/20 !bg-black/5 !text-black dark:!border-white/20 dark:!bg-white/10 dark:!text-white'
          : ' bg-gray-100/5'}"
        onclick={() => (activeAside = 'background')}
      >
        <ImageIcon class="h-4 w-4" />
        <span class="text-[11px] font-medium leading-none">Background</span>
      </Button>
    </nav>
  </div>
</main>
