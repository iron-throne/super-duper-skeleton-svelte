<script lang="ts">
    import DynamicInput from '$lib/components/customInput/Input.svelte';
    import { EInputType } from '$lib/types';
    import type { IFormField } from '$lib/types';

    type SectionedField = IFormField & { span?: 1 | 2 };
    type Section = { title: string; icon: string; fields: SectionedField[] };

    let sections: Section[] = $state([
        {
            title: 'Personal Info',
            icon: '👤',
            fields: [
                {
                    key: 'name', id: 'name',
                    label: 'Full Name', placeholder: 'Jane Doe',
                    type: EInputType.TEXT, required: true,
                    helperText: 'Enter your legal name',
                },
                {
                    key: 'age', id: 'age',
                    label: 'Age', placeholder: '18',
                    type: EInputType.NUMBER,
                    attributes: { min: 1, max: 120 } as Record<string, string | number | boolean>,
                },
                {
                    key: 'email', id: 'email',
                    label: 'Email', placeholder: 'you@example.com',
                    type: EInputType.EMAIL, required: true,
                },
                {
                    key: 'phone', id: 'phone',
                    label: 'Phone', placeholder: '+1 555 000 0000',
                    type: EInputType.TEL,
                },
                {
                    key: 'bio', id: 'bio',
                    label: 'Bio', placeholder: 'Tell us about yourself…',
                    type: EInputType.TEXTAREA,
                    attributes: { rows: 3 } as Record<string, string | number | boolean>,
                    span: 2,
                },
                {
                    key: 'gender', id: 'gender',
                    label: 'Gender',
                    type: EInputType.RADIO,
                    span: 2,
                    options: [
                        { label: 'Male', value: 'male' },
                        { label: 'Female', value: 'female' },
                        { label: 'Other', value: 'other' },
                    ],
                },
            ],
        },
        {
            title: 'Account & Security',
            icon: '🔐',
            fields: [
                {
                    key: 'password', id: 'password',
                    label: 'Password', placeholder: 'Min. 8 characters',
                    type: EInputType.PASSWORD, required: true,
                },
                {
                    key: 'website', id: 'website',
                    label: 'Website', placeholder: 'https://yoursite.com',
                    type: EInputType.URL,
                },
                {
                    key: 'country', id: 'country',
                    label: 'Country',
                    placeholder: 'Select a country…',
                    type: EInputType.SELECT,
                    span: 2,
                    options: [
                        { label: 'United States', value: 'us' },
                        { label: 'United Kingdom', value: 'uk' },
                        { label: 'Spain', value: 'es' },
                        { label: 'Saudi Arabia', value: 'sa' },
                    ],
                },
            ],
        },
        {
            title: 'Scheduling',
            icon: '📅',
            fields: [
                {
                    key: 'dob', id: 'dob',
                    label: 'Date of Birth',
                    type: EInputType.DATE,
                },
                {
                    key: 'meeting', id: 'meeting',
                    label: 'Meeting Time',
                    type: EInputType.TIME,
                },
                {
                    key: 'appointment', id: 'appointment',
                    label: 'Appointment',
                    type: EInputType.DATETIME_LOCAL,
                    span: 2,
                },
            ],
        },
        {
            title: 'Preferences',
            icon: '🎨',
            fields: [
                {
                    key: 'rating', id: 'rating',
                    label: 'Rating',
                    type: EInputType.RANGE,
                    value: 50,
                    attributes: { min: 0, max: 100, step: 1 } as Record<string, string | number | boolean>,
                },
                {
                    key: 'color', id: 'color',
                    label: 'Favourite Color',
                    type: EInputType.COLOR,
                    value: '#CA0613',
                },
                {
                    key: 'tags', id: 'tags',
                    label: 'Tags',
                    type: EInputType.MULTISELECT,
                    value: [],
                    span: 2,
                    options: [
                        { label: 'Abstract', value: 'abstract' },
                        { label: 'Modern', value: 'modern' },
                        { label: 'Classic', value: 'classic' },
                        { label: 'Digital', value: 'digital' },
                        { label: 'Oil', value: 'oil' },
                    ],
                    helperText: 'Click tags to toggle selection',
                },
                {
                    key: 'category', id: 'category',
                    label: 'Category (Add New)',
                    placeholder: 'Select…',
                    type: EInputType.SELECT_ADDNEW,
                    span: 2,
                    options: [
                        { label: 'Painting', value: 'painting' },
                        { label: 'Sculpture', value: 'sculpture' },
                    ],
                    helperText: 'Type a new option and press Add or Enter',
                },
                {
                    key: 'styles', id: 'styles',
                    label: 'Art Styles (Add New)',
                    type: EInputType.MULTISELECT_ADDNEW,
                    value: [],
                    span: 2,
                    options: [
                        { label: 'Impressionism', value: 'impressionism' },
                        { label: 'Surrealism', value: 'surrealism' },
                    ],
                },
            ],
        },
        {
            title: 'Content',
            icon: '✍️',
            fields: [
                {
                    key: 'search', id: 'search',
                    label: 'Search',
                    placeholder: 'Search artworks…',
                    type: EInputType.SEARCH,
                    span: 2,
                },
                {
                    key: 'description', id: 'description',
                    label: 'Rich Description',
                    type: EInputType.RICHTEXT,
                    helperText: 'HTML rich text area',
                    span: 2,
                },
            ],
        },
        {
            title: 'Uploads',
            icon: '📎',
            fields: [
                {
                    key: 'avatar', id: 'avatar',
                    label: 'Profile Picture',
                    type: EInputType.FILE,
                    helperText: 'JPG, PNG up to 5 MB',
                },
                {
                    key: 'docs', id: 'docs',
                    label: 'Upload Documents',
                    type: EInputType.FILE,
                    multiple: true,
                },
            ],
        },
        {
            title: 'Demo & Edge Cases',
            icon: '🧪',
            fields: [
                {
                    key: 'error_demo', id: 'error_demo',
                    label: 'Field with Error',
                    placeholder: 'Something went wrong',
                    type: EInputType.TEXT,
                    errorMsg: 'This field is required',
                },
                {
                    key: 'disabled_demo', id: 'disabled_demo',
                    label: 'Disabled Field',
                    placeholder: 'Cannot edit this',
                    type: EInputType.TEXT,
                    disabled: true,
                    value: 'Read-only value',
                },
                {
                    key: 'terms', id: 'terms',
                    label: 'Terms & Conditions',
                    placeholder: 'I agree to the terms and conditions',
                    type: EInputType.CHECKBOX,
                    required: true,
                    span: 2,
                },
            ],
        },
    ]);
</script>

<div class="min-h-screen bg-surface-tertiary text-content-primary py-12 px-4">
    <!-- Page Header -->
    <div class="max-w-3xl mx-auto mb-10 text-center">
        <div class="inline-flex items-center gap-2 bg-brand-primary/10 text-brand-primary text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            Dynamic Form
        </div>
        <h1 class="text-4xl font-bold text-content-primary mb-2">Form Showcase</h1>
        <p class="text-content-secondary text-base">All input types demonstrated in a structured, sectioned layout.</p>
    </div>

    <!-- Form -->
    <form
        onsubmit={(e) => e.preventDefault()}
        class="max-w-3xl mx-auto flex flex-col gap-6"
    >
        {#each sections as section}
            <div class="bg-surface-primary rounded-2xl border  shadow-sm overflow-hidden">
                <!-- Section Header -->
                <div class="flex items-center gap-3 px-6 py-4 border-b  bg-surface-secondary/30">
                    <span class="text-xl" aria-hidden="true">{section.icon}</span>
                    <h2 class="text-base font-semibold text-content-primary">{section.title}</h2>
                </div>

                <!-- Section Fields Grid -->
                <div class="grid grid-cols-2 gap-x-6 gap-y-5 p-6">
                    {#each section.fields as field}
                        <div class={field.span === 2 ? 'col-span-2' : 'col-span-1'}>
                            <DynamicInput {field} />
                        </div>
                    {/each}
                </div>
            </div>
        {/each}

        <!-- Submit -->
        <button type="submit" class="btn btn-primary w-full py-3 text-base font-semibold rounded-xl shadow-md">
            Submit Form
        </button>
    </form>
</div>
