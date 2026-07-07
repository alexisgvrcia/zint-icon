<script lang="ts">
  import {
    selectedIcon,
    iconColor,
    iconSize,
    iconOffsetX,
    iconOffsetY,
    iconGlass,
    iconGlow,
    customContentType
  } from '$lib/stores/icon';
  import ColorField from '$lib/components/ui/color-field.svelte';
  import Input from '$lib/components/ui/input.svelte';
  import Slider from '$lib/components/ui/slider.svelte';
  import { debounce } from '$lib/utils/debounce';

  function updateIconColor(color: string) {
    iconColor.set(color);
  }

  const debouncedUpdateIconColor = debounce(updateIconColor, 150);
</script>

<div class="space-y-4 overflow-hidden">
  {#if !($selectedIcon === 'Custom' && $customContentType === 'png')}
    <ColorField
      label="Icon Color"
      bind:value={$iconColor}
      oninput={(e) => debouncedUpdateIconColor(e.currentTarget.value)}
      placeholder="#ffffff"
    />
  {/if}

  <Slider
    value={$iconSize}
    min={20}
    max={512}
    step={1}
    label="Size"
    onChange={(value) => iconSize.set(value)}
  />

  <Slider
    value={$iconOffsetX}
    min={-256}
    max={256}
    step={1}
    label="Offset X"
    onChange={(value) => iconOffsetX.set(value)}
  />

  <Slider
    value={$iconOffsetY}
    min={-256}
    max={256}
    step={1}
    label="Offset Y"
    onChange={(value) => iconOffsetY.set(value)}
  />

  {#if !($selectedIcon === 'Custom' && $customContentType === 'png')}
    <div class="hidden xl:block">
      <Input type="checkbox" bind:value={$iconGlass} label="Glass Effect" />
    </div>

    <div class="hidden xl:block">
      <Input type="checkbox" bind:value={$iconGlow} label="Glow Effect" />
    </div>
  {/if}
</div>
