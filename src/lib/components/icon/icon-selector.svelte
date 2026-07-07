<script lang="ts">
  import { cn } from '$lib/utils';
  import { tick } from 'svelte';
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

  function isFileDrag(event: DragEvent) {
    return event.dataTransfer?.types.includes('Files') ?? false;
  }

  const availableIcons = $derived(() => {
    const names = [...ICON_NAMES];
    if ($customSvg.trim() || $customPng.trim()) {
      names.unshift('Custom');
    }
    return names;
  });

  function processUploadedFile(file: File) {
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
      return;
    }

    if (file.type.startsWith('image/')) {
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
      return;
    }

    toast.error('Unsupported file type. Use SVG, PNG, JPG or WebP.');
  }

  function handleFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      processUploadedFile(file);
    }
    target.value = '';
  }

  let fileInput = $state<HTMLInputElement>();
  let scrollViewport = $state<HTMLDivElement>();
  let pageDragDepth = 0;
  let dropZoneDragDepth = 0;

  let searchQuery = $state('');
  let showTopFade = $state(false);
  let showBottomFade = $state(true);
  let isPageDragActive = $state(false);
  let isDropTargetActive = $state(false);

  const filteredIcons = $derived(() => {
    if (!searchQuery.trim()) return availableIcons();
    return availableIcons().filter((name) =>
      name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  function updateScrollFade() {
    if (!scrollViewport) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollViewport;
    const maxScrollTop = scrollHeight - clientHeight;

    showTopFade = scrollTop > 0;
    showBottomFade = maxScrollTop - scrollTop > 1;
  }

  $effect(() => {
    filteredIcons();

    tick().then(updateScrollFade);
  });

  function clearDragState() {
    pageDragDepth = 0;
    dropZoneDragDepth = 0;
    isPageDragActive = false;
    isDropTargetActive = false;
  }

  function handleWindowDragEnter(event: DragEvent) {
    if (!isFileDrag(event)) return;

    event.preventDefault();
    pageDragDepth += 1;
    isPageDragActive = true;
  }

  function handleWindowDragOver(event: DragEvent) {
    if (!isFileDrag(event)) return;

    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
    isPageDragActive = true;
  }

  function handleWindowDragLeave(event: DragEvent) {
    if (!isFileDrag(event)) return;

    event.preventDefault();
    pageDragDepth = Math.max(0, pageDragDepth - 1);

    if (pageDragDepth === 0) {
      clearDragState();
    }
  }

  function handleWindowDrop(event: DragEvent) {
    if (!isFileDrag(event)) return;

    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];

    clearDragState();

    if (file) {
      processUploadedFile(file);
    }
  }

  function handleDropZoneDragEnter(event: DragEvent) {
    if (!isFileDrag(event)) return;

    event.preventDefault();
    dropZoneDragDepth += 1;
    isDropTargetActive = true;
  }

  function handleDropZoneDragOver(event: DragEvent) {
    if (!isFileDrag(event)) return;

    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
    isDropTargetActive = true;
  }

  function handleDropZoneDragLeave(event: DragEvent) {
    if (!isFileDrag(event)) return;

    event.preventDefault();
    dropZoneDragDepth = Math.max(0, dropZoneDragDepth - 1);

    if (dropZoneDragDepth === 0) {
      isDropTargetActive = false;
    }
  }

  function handleDropZoneDrop(event: DragEvent) {
    if (!isFileDrag(event)) return;

    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer?.files?.[0];

    clearDragState();

    if (file) {
      processUploadedFile(file);
    }
  }
</script>

<svelte:window
  ondragenter={handleWindowDragEnter}
  ondragover={handleWindowDragOver}
  ondragleave={handleWindowDragLeave}
  ondrop={handleWindowDrop}
/>

<div
  role="region"
  aria-label="Icon selector"
  class={cn(
    'relative flex flex-1 flex-col space-y-4 overflow-hidden rounded-[18px] transition-[background-color,box-shadow] duration-150',
    isPageDragActive && 'shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]'
  )}
  ondragenter={handleDropZoneDragEnter}
  ondragover={handleDropZoneDragOver}
  ondragleave={handleDropZoneDragLeave}
  ondrop={handleDropZoneDrop}
>
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
          onclick={() => fileInput?.click()}
          title="Upload Icon"
          class={cn(
            'dark:hover:!bg-white/8 h-9 w-9 !border-transparent !bg-transparent hover:!bg-black/5',
            isPageDragActive &&
              'bg-black/[0.16] text-black shadow-[0_0_0_1px_rgba(0,0,0,0.1)] dark:bg-white/[0.2] dark:text-white dark:shadow-[0_0_0_1px_rgba(255,255,255,0.12)]'
          )}
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

  {#if isPageDragActive}
    <div
      class={cn(
        'flex min-h-64 items-center justify-center rounded-[16px] border border-dashed px-6 text-center transition-[border-color,background-color,box-shadow] duration-150',
        isDropTargetActive
          ? 'border-black/30 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] dark:border-white/30 dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
          : 'border-black/20 dark:border-white/20'
      )}
    >
      <div class="flex flex-col items-center justify-center gap-2.5">
        <div
          class={cn(
            'flex h-12 w-12 items-center justify-center text-black/80 transition-[color,transform] duration-150 dark:text-white/88',
            isDropTargetActive && 'scale-[1.02] text-black dark:text-white'
          )}
        >
          <Upload class="h-4 w-4" />
        </div>
        <div class="space-y-1">
          <p class="text-sm font-medium tracking-[-0.03em] text-black/92 dark:text-white">
            Drop your icon here
          </p>
          <p class="text-xs tracking-[-0.02em] text-black/72 dark:text-white/72">
            SVG, PNG, JPG or WebP
          </p>
        </div>
      </div>
    </div>
  {:else}
    <div
      bind:this={scrollViewport}
      onscroll={updateScrollFade}
      class={cn(
        'max-h-64 min-h-64 overflow-y-auto',
        showTopFade &&
          showBottomFade &&
          '[-webkit-mask-image:linear-gradient(to_bottom,_transparent_0,_#000_28px,_#000_calc(100%_-_28px),_transparent_100%)] [mask-image:linear-gradient(to_bottom,_transparent_0,_#000_28px,_#000_calc(100%_-_28px),_transparent_100%)]',
        showTopFade &&
          !showBottomFade &&
          '[-webkit-mask-image:linear-gradient(to_bottom,_transparent_0,_#000_28px,_#000_100%)] [mask-image:linear-gradient(to_bottom,_transparent_0,_#000_28px,_#000_100%)]',
        !showTopFade &&
          showBottomFade &&
          '[-webkit-mask-image:linear-gradient(to_bottom,_#000_0,_#000_calc(100%_-_28px),_transparent_100%)] [mask-image:linear-gradient(to_bottom,_#000_0,_#000_calc(100%_-_28px),_transparent_100%)]'
      )}
    >
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
                'group min-h-14 rounded-none border-0 bg-[#f4f5fa] p-0 shadow-none transition-[background-color,color,opacity] duration-100 hover:bg-gray-200 dark:bg-[#1f1f1f] dark:hover:bg-white/[0.05]',
                $selectedIcon === iconName
                  ? '!bg-gray-300 text-black dark:!bg-white/[0.035] dark:text-white'
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
  {/if}
</div>
