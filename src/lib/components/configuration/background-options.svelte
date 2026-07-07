<script lang="ts">
  import { flip } from 'svelte/animate';
  import { cubicOut } from 'svelte/easing';
  import { slide } from 'svelte/transition';
  import { Plus, Minus, RefreshCw } from 'lucide-svelte';
  import Button from '$lib/components/ui/button.svelte';
  import ColorField from '$lib/components/ui/color-field.svelte';
  import Slider from '$lib/components/ui/slider.svelte';
  import Input from '$lib/components/ui/input.svelte';
  import {
    noise,
    borderRadius,
    borderStroke,
    borderColor,
    borderOpacity,
    meshGradientColors,
    background3D,
    background3DRotation,
    contrast,
    saturation,
    brightness
  } from '$lib/stores/icon';
  import { createMeshGradientColor, generateRandomPosition } from '$lib/utils';
  import { debounce } from '$lib/utils/debounce';

  function updateNoise(value: number) {
    noise.set(value);
  }

  function updateBorderRadius(value: number) {
    borderRadius.set(value);
  }

  function updateBorderStroke(value: number) {
    borderStroke.set(value);
  }

  function updateBorderColor(color: string) {
    borderColor.set(color);
  }

  const debouncedUpdateBorderColor = debounce(updateBorderColor, 150);

  function updateBorderOpacity(value: number) {
    borderOpacity.set(value);
  }

  function updateMeshGradientColor(index: number, color: string) {
    meshGradientColors.set(
      $meshGradientColors.map((item, i) => (i === index ? { ...item, color } : item))
    );
  }

  const debouncedUpdateMeshGradientColor = debounce(updateMeshGradientColor, 150);

  function addMeshGradientColor() {
    meshGradientColors.set([...$meshGradientColors, createMeshGradientColor('#8564FA')]);
  }

  function refreshMeshPositions() {
    meshGradientColors.set(
      $meshGradientColors.map((item) => ({
        ...item,
        ...generateRandomPosition()
      }))
    );
  }

  function removeMeshGradientColor(index: number) {
    if ($meshGradientColors.length > 1) {
      meshGradientColors.set($meshGradientColors.filter((_, i) => i !== index));
    }
  }

  function updateBackground3DRotation(value: number) {
    background3DRotation.set(value);
  }

  function updateContrast(value: number) {
    contrast.set(value);
  }

  function updateSaturation(value: number) {
    saturation.set(value);
  }

  function updateBrightness(value: number) {
    brightness.set(value);
  }
</script>

<div class="space-y-4 overflow-hidden">
  <div class="space-y-3">
    <div class="flex items-center justify-between gap-3 px-1">
      <h2 class="text-sm font-medium text-gray-700 dark:text-gray-300">Background Palette</h2>
      <div class="flex gap-2">
        <Button
          variant="glass-icon"
          size="sm"
          onclick={refreshMeshPositions}
          class="dark:hover:!bg-white/8 h-9 w-9 !border-transparent !bg-transparent hover:!bg-black/5"
        >
          <RefreshCw class="h-3 w-3" />
        </Button>
        {#if $meshGradientColors.length < 6}
          <Button
            variant="glass-icon"
            size="sm"
            onclick={addMeshGradientColor}
            class="dark:hover:!bg-white/8 h-9 w-9 !border-transparent !bg-transparent hover:!bg-black/5"
          >
            <Plus class="h-3 w-3" />
          </Button>
        {/if}
      </div>
    </div>
    <div class="bg-black/8 dark:bg-white/8 h-px"></div>
  </div>

  <div class="space-y-2 overflow-hidden">
    {#each $meshGradientColors as meshColor, index (meshColor.id)}
      <div
        animate:flip={{ duration: 220, easing: cubicOut }}
        in:slide={{ duration: 220, easing: cubicOut }}
        out:slide={{ duration: 220, easing: cubicOut }}
        class="overflow-hidden"
      >
        <div
          class="border-black/8 hover:border-black/12 focus-within:border-black/14 dark:border-white/8 dark:hover:border-white/12 dark:focus-within:border-white/14 group relative flex h-9 items-center gap-3 overflow-hidden rounded-[12px] border bg-[#eeeff3] px-3 transition-[border-color,background-color,box-shadow] duration-100 focus-within:bg-[#e7e9ef] focus-within:shadow-[0_1px_2px_rgba(15,23,42,0.05)] hover:bg-[#e9ebf1] dark:bg-[#2b2b2b] dark:focus-within:bg-[#313131] dark:focus-within:shadow-[0_1px_2px_rgba(0,0,0,0.22)] dark:hover:bg-[#303030]"
        >
          <div
            class="relative h-5 w-5 shrink-0 overflow-hidden rounded-[5px] bg-white/40 shadow-[0_0_0_1px_rgba(0,0,0,0.06)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
          >
            <input
              type="color"
              bind:value={meshColor.color}
              oninput={(e) => debouncedUpdateMeshGradientColor(index, e.currentTarget.value)}
              class="absolute inset-0 h-full w-full cursor-pointer appearance-none border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
            />
          </div>

          <input
            type="text"
            bind:value={meshColor.color}
            oninput={(e) => debouncedUpdateMeshGradientColor(index, e.currentTarget.value)}
            class="text-black/82 placeholder:text-black/38 dark:text-white/92 dark:placeholder:text-white/34 min-w-0 flex-1 bg-transparent text-[14px] font-medium tracking-[-0.03em] outline-none"
            placeholder="#000000"
          />

          {#if $meshGradientColors.length > 1}
            <Button
              variant="glass-icon"
              size="sm"
              onclick={() => removeMeshGradientColor(index)}
              class="hover:!bg-red-500/18 dark:hover:!bg-red-500/16 h-7 w-7 flex-shrink-0 rounded-[8px] !border-transparent !bg-transparent !p-0"
            >
              <Minus class="h-3 w-3 text-red-400" />
            </Button>
          {/if}
        </div>
      </div>
    {/each}
  </div>

  <div class="space-y-3 pt-1">
    <div class="px-1">
      <h2 class="text-sm font-medium text-gray-700 dark:text-gray-300">Background Settings</h2>
    </div>
    <div class="bg-black/8 dark:bg-white/8 h-px"></div>
  </div>

  <Slider value={$noise} min={0} max={100} step={1} label="Noise" onChange={updateNoise} />

  <Slider value={$contrast} min={0} max={200} step={1} label="Contrast" onChange={updateContrast} />

  <Slider
    value={$saturation}
    min={0}
    max={200}
    step={1}
    label="Saturation"
    onChange={updateSaturation}
  />

  <Slider
    value={$brightness}
    min={0}
    max={200}
    step={1}
    label="Brightness"
    onChange={updateBrightness}
  />

  <Slider
    value={$borderRadius}
    min={0}
    max={300}
    step={1}
    label="Border Radius"
    onChange={updateBorderRadius}
  />

  <Slider
    value={$borderStroke}
    min={0}
    max={20}
    step={1}
    label="Border Stroke"
    onChange={updateBorderStroke}
  />

  {#if $borderStroke > 0}
    <div
      class="rounded-2xl border border-black/10 bg-gray-100/5 p-4 backdrop-blur-sm dark:border-[#333] dark:bg-[#1f1f1f57]"
    >
      <ColorField
        label="Border Color"
        bind:value={$borderColor}
        oninput={(e) => debouncedUpdateBorderColor(e.currentTarget.value)}
        placeholder="#ffffff"
      />
    </div>

    <Slider
      value={$borderOpacity}
      min={0}
      max={100}
      step={1}
      label="Border Opacity"
      onChange={updateBorderOpacity}
    />
  {/if}

  <Input type="checkbox" bind:value={$background3D} label="3D Effect" />

  {#if $background3D}
    <Slider
      value={$background3DRotation}
      min={-120}
      max={120}
      step={1}
      label="3D Rotation"
      onChange={updateBackground3DRotation}
    />
  {/if}
</div>
