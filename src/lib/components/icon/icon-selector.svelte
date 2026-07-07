<script lang="ts">
  import { cn } from '$lib/utils';
  import { Search, ShuffleIcon } from 'lucide-svelte';
  import { AVAILABLE_ICONS, getIconSvg, ICON_NAMES, getRandomIcon } from '$lib/data/icons';
  import Button from '$lib/components/ui/button.svelte';
  import { Upload } from 'lucide-svelte';
  import { selectedIcon, customSvg, customPng, customContentType } from '$lib/stores/icon';
  import { toast } from 'svelte-sonner';

  function selectRandomIcon() {
    const randomIcon = getRandomIcon();
    selectedIcon.set(randomIcon);
  }

  const availableIcons = $derived(() => {
    const names = [...ICON_NAMES];
    if ($customSvg.trim() || $customPng.trim()) {
      names.unshift('Custom');
    }
    return names;
  });

  function handleFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      if (file.type === 'image/svg+xml') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const svgContent = e.target?.result as string;
          customSvg.set(svgContent);
          customPng.set('');
          customContentType.set('svg');
          selectedIcon.set('Custom');
        };
        reader.readAsText(file);
        toast.success('SVG icon uploaded successfully!');
      } else if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const pngContent = e.target?.result as string;
          customPng.set(pngContent);
          customSvg.set('');
          customContentType.set('png');
          selectedIcon.set('Custom');
        };
        reader.readAsDataURL(file);
        toast.success('Image icon uploaded successfully!');
      }
    }
    target.value = '';
  }

  let fileInput: HTMLInputElement;

  let searchQuery = $state('');

  const filteredIcons = $derived(() => {
    if (!searchQuery.trim()) return availableIcons();
    return availableIcons().filter((name) =>
      name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
</script>

<div class="flex flex-1 flex-col space-y-4 overflow-hidden">
  <div class="space-y-3">
    <div class="flex items-center justify-between gap-3 px-1">
      <h2 class="text-sm font-medium text-gray-700 dark:text-gray-300">Icon Selector</h2>

      <div class="flex gap-2">
        <Button
          variant="glass-icon"
          size="sm"
          onclick={selectRandomIcon}
          title="Random Icon"
          class="dark:hover:!bg-white/8 h-9 w-9 !border-transparent !bg-transparent hover:!bg-black/5"
        >
          <ShuffleIcon class="h-4 w-4" />
        </Button>

        <Button
          variant="glass-icon"
          size="sm"
          onclick={() => fileInput.click()}
          title="Upload Icon"
          class="dark:hover:!bg-white/8 h-9 w-9 !border-transparent !bg-transparent hover:!bg-black/5"
        >
          <Upload class="h-4 w-4" />
        </Button>

        <input
          bind:this={fileInput}
          type="file"
          accept=".svg,.png,.jpg,.jpeg,.webp,image/svg+xml,image/png,image/jpeg,image/webp"
          onchange={handleFileUpload}
          class="hidden"
        />
      </div>
    </div>

    <div class="bg-black/8 dark:bg-white/8 h-px"></div>

    <label
      class="border-black/8 hover:border-black/12 focus-within:border-black/14 dark:border-white/8 dark:hover:border-white/12 dark:focus-within:border-white/14 group relative flex h-9 items-center overflow-hidden rounded-[12px] border bg-[#eeeff3] px-3 transition-[border-color,background-color,box-shadow] duration-100 focus-within:bg-[#e7e9ef] focus-within:shadow-[0_1px_2px_rgba(15,23,42,0.05)] hover:bg-[#e9ebf1] dark:bg-[#2b2b2b] dark:focus-within:bg-[#313131] dark:focus-within:shadow-[0_1px_2px_rgba(0,0,0,0.22)] dark:hover:bg-[#303030]"
    >
      <Search class="dark:text-white/34 mr-2 h-4 w-4 shrink-0 text-black/40" />
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search icons..."
        class="text-black/72 placeholder:text-black/38 dark:text-white/84 dark:placeholder:text-white/34 min-w-0 flex-1 bg-transparent text-[14px] font-medium tracking-[-0.03em] outline-none"
      />
    </label>
  </div>

  <div class="max-h-64 min-h-64 overflow-y-auto">
    <div
      class="border-black/8 dark:border-white/8 overflow-hidden rounded-[14px] border bg-black/[0.06] p-px dark:bg-white/[0.08]"
    >
      <div class="bg-black/8 dark:bg-white/8 grid grid-cols-4 gap-px">
        {#each filteredIcons() as iconName, index (iconName)}
          <Button
            variant="glass-nav"
            size="sm"
            onclick={() => selectedIcon.set(iconName)}
            title={iconName}
            class={cn(
              'group min-h-14 rounded-none border-0 bg-[#f4f5fa] p-0 shadow-none transition-[background-color,color,opacity] duration-100 hover:bg-black/[0.035] dark:bg-[#1f1f1f] dark:hover:bg-white/[0.05]',
              $selectedIcon === iconName
                ? '!bg-black/[0.06] text-black dark:!bg-white/[0.08] dark:text-white'
                : '',
              index === 0 && 'rounded-tl-[13px]',
              index === Math.min(3, filteredIcons().length - 1) && 'rounded-tr-[13px]',
              index === Math.floor((filteredIcons().length - 1) / 4) * 4 && 'rounded-bl-[13px]',
              index === filteredIcons().length - 1 && 'rounded-br-[13px]'
            )}
          >
            <div class="flex h-full w-full items-center justify-center p-3">
              <div
                class={cn(
                  'h-7 w-7 transition-[transform,opacity,color] duration-100 group-hover:scale-[0.98] [&>svg]:h-full [&>svg]:w-full',
                  $selectedIcon === iconName
                    ? '[&>svg]:stroke-black dark:[&>svg]:stroke-white'
                    : 'opacity-80 group-hover:opacity-100 [&>svg]:stroke-black dark:[&>svg]:stroke-white'
                )}
              >
                {#if iconName === 'Custom'}
                  {#if $customContentType === 'png'}
                    <img
                      src={$customPng}
                      alt="Custom"
                      class="h-full w-full rounded-[4px] object-contain shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
                    />
                  {:else}
                    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                    {@html getIconSvg(iconName, $customSvg, $customPng, $customContentType)}
                  {/if}
                {:else}
                  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                  {@html AVAILABLE_ICONS[iconName]}
                {/if}
              </div>
            </div>
          </Button>
        {/each}
      </div>
    </div>

    {#if filteredIcons().length === 0}
      <div class="flex flex-col items-center justify-center py-12 text-center">
        <Search class="mb-4 h-12 w-12 text-gray-400 dark:text-gray-600" />
        <p class="text-sm text-gray-600 dark:text-gray-400">No icons found</p>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-600">Try a different search term</p>
      </div>
    {/if}
  </div>
</div>
