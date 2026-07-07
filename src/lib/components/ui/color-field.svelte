<script lang="ts">
  import { cn } from '$lib/utils';

  interface Props {
    label: string;
    value?: string;
    placeholder?: string;
    class?: string;
    oninput?: (event: Event & { currentTarget: HTMLInputElement }) => void;
  }

  let {
    label,
    value = $bindable(),
    placeholder = '#000000',
    class: className = '',
    oninput
  }: Props = $props();

  function handleInput(event: Event & { currentTarget: HTMLInputElement }) {
    value = event.currentTarget.value;
    oninput?.(event);
  }
</script>

<label
  class={cn(
    'border-black/8 hover:border-black/12 focus-within:border-black/14 dark:border-white/8 dark:hover:border-white/12 dark:focus-within:border-white/14 group relative flex h-9 items-center gap-3 overflow-hidden rounded-[12px] border bg-[#eeeff3] px-3 transition-[border-color,background-color,box-shadow] duration-100 focus-within:bg-[#e7e9ef] focus-within:shadow-[0_1px_2px_rgba(15,23,42,0.05)] hover:bg-[#e9ebf1] dark:bg-[#2b2b2b] dark:focus-within:bg-[#313131] dark:focus-within:shadow-[0_1px_2px_rgba(0,0,0,0.22)] dark:hover:bg-[#303030]',
    className
  )}
>
  <span
    class="text-black/62 dark:text-white/78 shrink-0 text-[14px] font-medium tracking-[-0.03em]"
  >
    {label}
  </span>

  <input
    type="text"
    bind:value
    {placeholder}
    oninput={handleInput}
    class="text-black/82 placeholder:text-black/38 dark:text-white/92 dark:placeholder:text-white/34 min-w-0 flex-1 bg-transparent text-right text-[14px] font-medium tracking-[-0.03em] outline-none"
  />

  <div class="bg-black/8 dark:bg-white/8 h-5 w-px shrink-0"></div>

  <div
    class="relative h-5 w-5 shrink-0 overflow-hidden rounded-[5px] bg-white/40 shadow-[0_0_0_1px_rgba(0,0,0,0.06)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
  >
    <input
      type="color"
      bind:value
      oninput={handleInput}
      class="absolute inset-0 h-full w-full cursor-pointer appearance-none border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-none"
    />
  </div>
</label>
