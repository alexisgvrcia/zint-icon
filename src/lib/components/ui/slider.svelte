<script lang="ts">
  import NumberFlow from '@number-flow/svelte';
  import { cn } from '$lib/utils';

  interface Props {
    value: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    label?: string;
    showValue?: boolean;
    class?: string;
    onChange?: (value: number) => void;
  }

  let {
    value = 0,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    label = '',
    showValue = true,
    class: className = '',
    onChange,
    ...restProps
  }: Props = $props();

  let isActive = $state(false);

  const decimals = $derived((step.toString().split('.')[1] ?? '').length);
  const numberFormat = $derived({
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
  const range = $derived(Math.max(max - min, step || 1));
  const percentage = $derived(Math.max(0, Math.min(100, ((value - min) / range) * 100)));
  const totalSteps = $derived((max - min) / step);

  const marks = $derived.by(() => {
    if (totalSteps <= 10) {
      return Array.from({ length: Math.max(totalSteps - 1, 0) }, (_, index) => ({
        key: `d-${index + 1}`,
        left: (((index + 1) * step) / (max - min)) * 100
      }));
    }

    return Array.from({ length: 9 }, (_, index) => ({
      key: `t-${index + 1}`,
      left: (index + 1) * 10
    }));
  });

  function handleInput(event: Event & { currentTarget: HTMLInputElement }) {
    value = Number(event.currentTarget.value);
    onChange?.(value);
  }

  function setActive(state: boolean) {
    if (!disabled) isActive = state;
  }
</script>

<div class={cn('relative h-9', className)} {...restProps}>
  <div
    class={cn(
      'border-black/8 dark:border-white/8 group absolute inset-0 select-none overflow-hidden rounded-[12px] border bg-[#eeeff3] transition-[border-color,box-shadow,background-color] duration-75 dark:bg-[#2b2b2b]',
      disabled
        ? 'opacity-50'
        : 'hover:border-black/12 dark:hover:border-white/12 shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:bg-[#e9ebf1] dark:shadow-[0_1px_2px_rgba(0,0,0,0.2)] dark:hover:bg-[#303030]',
      isActive && 'border-black/14 dark:border-white/14 bg-[#e7e9ef] dark:bg-[#313131]'
    )}
  >
      <div
        class={cn(
          'pointer-events-none absolute inset-y-0 left-0 bg-black/[0.055] transition-[width,background-color] dark:bg-white/[0.09]',
          isActive ? 'bg-black/[0.075] duration-0 dark:bg-white/[0.14]' : 'duration-75'
        )}
        style={`width:${percentage}%`}
      ></div>

    <div class="pointer-events-none absolute inset-0">
      {#each marks as mark (mark.key)}
        <div
          class={cn(
            'bg-black/14 dark:bg-white/14 absolute top-1/2 h-3.5 w-px -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-[opacity,background-color] duration-75 group-hover:opacity-100',
            isActive && 'bg-black/18 opacity-100 dark:bg-white/20'
          )}
          style:left={`${mark.left}%`}
        ></div>
      {/each}
    </div>

    <div
      class={cn(
        'bg-black/28 dark:bg-white/44 h-4.5 pointer-events-none absolute top-1/2 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full transition-[left,height,background-color]',
        isActive ? 'bg-black/42 dark:bg-white/60 h-5.5 duration-0' : 'duration-75'
      )}
      style={`left:max(7px, min(calc(${percentage}% - 2px), calc(100% - 7px)))`}
    ></div>

    {#if label}
      <span
        class="text-black/62 dark:text-white/78 pointer-events-none absolute left-[12px] top-1/2 inline-flex -translate-y-1/2 items-center text-[14px] font-medium tracking-[-0.03em] transition-colors duration-75"
      >
        {label}
      </span>
    {/if}

    {#if showValue}
      <span
        class={cn(
          'text-black/82 dark:text-white/92 pointer-events-none absolute right-[12px] top-1/2 -translate-y-1/2 text-[14px] font-[Geist_Mono,monospace] font-medium tabular-nums tracking-[-0.04em] transition-colors duration-75',
          isActive && 'text-black dark:text-white'
        )}
      >
        <NumberFlow {value} format={numberFormat} respectMotionPreference={true} />
      </span>
    {/if}

    <input
      type="range"
      aria-label={label || undefined}
      {min}
      {max}
      {step}
      {disabled}
      bind:value
      oninput={handleInput}
      onpointerdown={() => setActive(true)}
      onpointerup={() => setActive(false)}
      onpointercancel={() => setActive(false)}
      onblur={() => setActive(false)}
      onfocus={() => setActive(true)}
      class="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
    />
  </div>
</div>

<style>
  input[type='range'] {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
  }

  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 44px;
    cursor: pointer;
  }

  input[type='range']::-moz-range-thumb {
    width: 24px;
    height: 44px;
    cursor: pointer;
    border: 0;
    background: transparent;
  }

  input[type='range']::-webkit-slider-runnable-track {
    background: transparent;
  }

  input[type='range']::-moz-range-track {
    background: transparent;
  }

  input[type='range']:focus {
    outline: none;
  }

  @media (prefers-reduced-motion: reduce) {
    input[type='range'],
    div,
    span {
      transition-duration: 0.01ms !important;
    }
  }
</style>
