<script lang="ts">
    import { buttonVariants, type ButtonProps } from "./index.js";
    import { cn } from "$lib/utils.js";

    let {
        class: className,
        variant = "default",
        size = "default",
        children,
        href,
        ...rest
    }: ButtonProps = $props();
</script>

{#if href}
    <a
        {href}
        class={cn(buttonVariants({ variant, size }), className)}
        {...rest}
    >
        {@render children?.()}
    </a>
{:else}
    <button
        class={cn(buttonVariants({ variant, size }), className)}
        {...rest}
    >
        {@render children?.()}
    </button>
{/if}
