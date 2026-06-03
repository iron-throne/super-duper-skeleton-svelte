<script lang="ts">
    import { Eye, EyeSlash, ExclamationCircle } from 'svelte-bootstrap-icons';
    import { EInputType } from '$lib/types';
    import type { IFormField, ISelectOption } from '$lib/types';

    let { field = $bindable() }: { field: IFormField } = $props();

    let showPassword = $state(false);
    let newOptionLabel = $state('');

    // Text-like native input types
    const nativeTextTypes = new Set([
        EInputType.TEXT, EInputType.EMAIL, EInputType.TEL, EInputType.URL,
        EInputType.SEARCH, EInputType.NUMBER, EInputType.DATE, EInputType.TIME,
        EInputType.DATETIME_LOCAL, EInputType.MONTH, EInputType.WEEK,
        EInputType.COLOR, EInputType.HIDDEN, EInputType.IMAGE,
    ]);

    const inputBase = [
        'w-full px-4 py-2 rounded-lg border ',
        'bg-surface-secondary/50 text-content-primary text-sm',
        'placeholder:text-content-tertiary',
        'focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent',
        'disabled:opacity-50 disabled:cursor-not-allowed transition',
    ].join(' ');

    const typeClasses: Partial<Record<EInputType, string>> = {
        [EInputType.COLOR]:        'h-10 px-2 py-1 cursor-pointer',
        [EInputType.PASSWORD]:     'pr-11',
        [EInputType.TEXTAREA]:     'resize-y',
        [EInputType.SELECT]:       'appearance-none cursor-pointer pr-10',
        [EInputType.SELECT_ADDNEW]:'appearance-none cursor-pointer pr-10',
        [EInputType.RICHTEXT]:     'min-h-[8rem] prose prose-sm max-w-none focus:outline-none',
        [EInputType.CHECKBOX]:     'w-4 h-4 rounded  accent-accent cursor-pointer',
        [EInputType.RANGE]:        'flex-1 accent-accent cursor-pointer',
        [EInputType.FILE]:         'file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-surface-secondary file:text-content-primary hover:file:bg-accent hover:file:text-surface-primary file:cursor-pointer file:transition disabled:opacity-50',
    };

    const inputClass = $derived(`${inputBase} ${typeClasses[field.type] ?? ''} ${field.classes ?? ''}`.trim());

    const inputAttributes = $derived({
        value: field.value as string | number | null | undefined,
        placeholder: field.placeholder,
        required: field.required,
        disabled: field.disabled,
        readonly: field.readOnly,
        multiple: field.multiple,
        class: inputClass,
        onblur: field.onBlur,
        onfocus: field.onFocus,
        ...field.attributes,
    });

    function emit(val: any) {
        field.value = val;
        field.onChange?.(val);
    }


    function addOption() {
        const label = newOptionLabel.trim();
        if (!label) return;
        field.options = [...(field.options ?? []), { label, value: label }];
        newOptionLabel = '';
    }

    function removeOption(opt: ISelectOption) {
        field.options = (field.options ?? []).filter(o => o.value !== opt.value);
    }
</script>

<div class="flex flex-col gap-1">
    <!-- Label -->
    {#if !field.hideLabel && field.type !== EInputType.HIDDEN}
        <label for={field.id} class="text-xs font-medium text-content-secondary flex items-center gap-1.5">
            {#if field.icon}
             <field.icon width={14} height={14} class="text-content-tertiary" />
            {/if}
            {field.label}
            {#if field.required}
                <span class="text-accent text-xs">*</span>
            {/if}
        </label>
    {/if}

    <!-- ── TEXT-LIKE INPUTS ── -->
    {#if nativeTextTypes.has(field.type)}
        <div class="relative">
            <input
                id={field.id}
                type={field.type}
                {...inputAttributes}
                oninput={(e) => emit((e.target as HTMLInputElement).value)}
            />
        </div>

    <!-- ── PASSWORD ── -->
    {:else if field.type === EInputType.PASSWORD}
        <div class="relative">
            <input
                id={field.id}
                type={showPassword ? EInputType.TEXT : EInputType.PASSWORD}
                {...inputAttributes}
                oninput={(e) => emit((e.target as HTMLInputElement).value)}
            />
            <button
                type="button"
                onclick={() => showPassword = !showPassword}
                class="absolute right-3 top-1/2 -translate-y-1/2 text-content-tertiary hover:text-content-primary transition"
                aria-label="Toggle password visibility"
            >
                {#if showPassword}
                    <EyeSlash width={16} height={16} />
                {:else}
                    <Eye width={16} height={16} />
                {/if}
            </button>
        </div>

    <!-- ── TEXTAREA ── -->
    {:else if field.type === EInputType.TEXTAREA}
        <textarea
            id={field.id}
            {...inputAttributes}
            oninput={(e) => emit((e.target as HTMLTextAreaElement).value)}
        ></textarea>

    <!-- ── CHECKBOX ── -->
    {:else if field.type === EInputType.CHECKBOX}
        <label class="flex items-center gap-3 cursor-pointer group">
            <input
                id={field.id}
                type="checkbox"
                {...inputAttributes}
                checked={!!field.value}
                onchange={(e) => emit((e.target as HTMLInputElement).checked)}
            />
            <span class="text-sm text-content-secondary group-hover:text-content-primary transition">
                {field.placeholder ?? field.label}
            </span>
        </label>

    <!-- ── RADIO ── -->
    {:else if field.type === EInputType.RADIO}
        <div class="flex flex-col gap-2">
            {#each (field.options ?? []) as opt}
                <label class="flex items-center gap-3 cursor-pointer group">
                    <input
                        type="radio"
                        name={field.id}
                        value={opt.value}
                        checked={field.value === opt.value}
                        class="w-4 h-4 accent-accent cursor-pointer"
                        onchange={() => emit(opt.value)}
                    />
                    <span class="text-sm text-content-secondary group-hover:text-content-primary transition">
                        {opt.label}
                    </span>
                </label>
            {/each}
        </div>

    <!-- ── RANGE ── -->
    {:else if field.type === EInputType.RANGE}
        <div class="flex items-center gap-3">
            <input
                id={field.id}
                type="range"
                               {...inputAttributes}
                oninput={(e) => emit(Number((e.target as HTMLInputElement).value))}
            />
            <span class="text-sm font-medium text-content-primary w-10 text-right tabular-nums">
                {field.value}
            </span>
        </div>

    <!-- ── FILE ── -->
    {:else if field.type === EInputType.FILE}
        <input
            id={field.id}
            type="file"
            {...inputAttributes}
            onchange={(e) => {
                const files = (e.target as HTMLInputElement).files;
                emit(field.multiple ? Array.from(files ?? []) : (files?.[0] ?? null));
            }}
        />

    <!-- ── SELECT ── -->
    {:else if field.type === EInputType.SELECT || field.type === EInputType.SELECT_ADDNEW}
        <select
            id={field.id}
            {...inputAttributes}
            onchange={(e) => emit((e.target as HTMLSelectElement).value)}
        >
            {#if field.placeholder}
                <option value="" disabled selected class="text-content-tertiary">{field.placeholder}</option>
            {/if}
            {#each (field.options ?? []) as opt}
                <option value={opt.value} class="bg-surface-primary text-content-primary">{opt.label}</option>
            {/each}
        </select>
        {#if field.type === EInputType.SELECT_ADDNEW}
            <div class="flex gap-2 mt-1">
                <input
                    type="text"
                    bind:value={newOptionLabel}
                    placeholder="New option…"
                    class="{inputBase} flex-1 py-2 text-sm"
                    onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addOption())}
                />
                <button type="button" onclick={addOption} class="btn btn-secondary px-4 py-2 text-sm">
                    Add
                </button>
            </div>
        {/if}

    <!-- ── MULTISELECT ── -->
    {:else if field.type === EInputType.MULTISELECT || field.type === EInputType.MULTISELECT_ADDNEW}
        <div class="flex flex-col gap-2">
            <div class="flex flex-wrap gap-2 p-2 rounded-lg border  bg-surface-secondary min-h-11">
                {#each (field.options ?? []) as opt}
                    {@const selected = Array.isArray(field.value) && field.value.includes(opt.value)}
                    <button
                        type="button"
                        onclick={() => {
                            const current: any[] = Array.isArray(field.value) ? [...field.value] : [];
                            const next = selected ? current.filter(v => v !== opt.value) : [...current, opt.value];
                            emit(next);
                        }}
                        class="px-3 py-1 rounded-full text-xs font-medium border transition
                            {selected
                                ? 'bg-accent text-surface-primary border-accent'
                                : 'bg-surface-primary text-content-secondary  hover:border-accent hover:text-content-primary'}"
                    >
                        {opt.label}
                    </button>
                {/each}
                {#if !(field.options?.length)}
                    <span class="text-xs text-content-tertiary self-center px-1">No options</span>
                {/if}
            </div>
            {#if field.type === EInputType.MULTISELECT_ADDNEW}
                <div class="flex gap-2">
                    <input
                        type="text"
                        bind:value={newOptionLabel}
                        placeholder="New option…"
                        class="{inputBase} flex-1 py-2 text-sm"
                        onkeydown={(e) => e.key === 'Enter' && (e.preventDefault(), addOption())}
                    />
                    <button type="button" onclick={addOption} class="btn btn-secondary px-4 py-2 text-sm">
                        Add
                    </button>
                </div>
            {/if}
            <!-- Remove options from list -->
            {#if field.options?.length}
                <div class="flex flex-wrap gap-1">
                    {#each (field.options ?? []) as opt}
                        <span class="flex items-center gap-1 text-xs text-content-tertiary bg-surface-secondary rounded px-2 py-0.5">
                            {opt.label}
                            {#if field.type === EInputType.MULTISELECT_ADDNEW}
                                <button type="button" onclick={() => removeOption(opt)} class="hover:text-accent transition">✕</button>
                            {/if}
                        </span>
                    {/each}
                </div>
            {/if}
        </div>

    <!-- ── RICHTEXT ── -->
    {:else if field.type === EInputType.RICHTEXT}
        <div
            id={field.id}
            contenteditable="true"
            role="textbox"
            aria-multiline="true"
            class={inputClass}
            oninput={(e) => emit((e.target as HTMLElement).innerHTML)}
        ></div>

    {/if}

    <!-- Helper / Error -->
    {#if field.errorMsg}
        <p class="text-xs text-error flex items-center gap-1">
            <ExclamationCircle width={12} height={12} />
            {field.errorMsg}
        </p>
    {:else if field.helperText}
        <p class="text-xs text-content-tertiary">{field.helperText}</p>
    {/if}

</div>
