<script lang="ts">
  import { cn } from '$lib/utils';

  interface Props {
    value?: boolean;
    label?: string;
    disabled?: boolean;
    class?: string;
    oninput?: (event: Event & { currentTarget: HTMLInputElement }) => void;
    onchange?: (event: Event & { currentTarget: HTMLInputElement }) => void;
    onfocus?: (event: FocusEvent & { currentTarget: HTMLInputElement }) => void;
    onblur?: (event: FocusEvent & { currentTarget: HTMLInputElement }) => void;
  }

  let {
    value = $bindable(false),
    label = '',
    disabled = false,
    class: className = '',
    oninput,
    onchange,
    onfocus,
    onblur
  }: Props = $props();

  function handleInput(event: Event & { currentTarget: HTMLInputElement }) {
    value = event.currentTarget.checked;
    oninput?.(event);
  }

  function handleChange(event: Event & { currentTarget: HTMLInputElement }) {
    value = event.currentTarget.checked;
    onchange?.(event);
  }
</script>

<div class={cn('flex items-center justify-between gap-3', className)}>
  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>

  <label class="group relative inline-flex cursor-pointer items-center">
    <input
      type="checkbox"
      checked={value}
      {disabled}
      oninput={handleInput}
      onchange={handleChange}
      {onfocus}
      {onblur}
      class="peer sr-only"
    />

    <div
      class="h-6 w-11 rounded-full border border-black/10 bg-black/[0.06] shadow-[inset_0_1px_1px_rgba(15,23,42,0.05)] transition-[background-color,border-color,box-shadow] duration-200 peer-checked:border-black/10 peer-checked:bg-black peer-focus-visible:ring-1 peer-focus-visible:ring-black/20 peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-white dark:border-white/10 dark:bg-white/[0.08] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] dark:peer-checked:border-white/20 dark:peer-checked:bg-white/90 dark:peer-focus-visible:ring-white/20 dark:peer-focus-visible:ring-offset-[#141415]"
    ></div>

    <div
      class="pointer-events-none absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white shadow-[0_1px_2px_rgba(15,23,42,0.18)] transition-all duration-200 ease-out peer-checked:translate-x-5 dark:bg-[#f5f5f7] dark:shadow-[0_1px_3px_rgba(0,0,0,0.45)] dark:peer-checked:bg-[#141415]"
    ></div>
  </label>
</div>
