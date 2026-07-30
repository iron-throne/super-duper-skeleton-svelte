<script lang="ts">
	// Reference page: shows @aryagg/layout-kit (Topbar, CollapsibleSidebar) providing the
	// app chrome, with @aryagg/ui-kit components filling in the page content.
	import { Topbar, CollapsibleSidebar } from '@aryagg/layout-kit';
	import {
		Button,
		Badge,
		Avatar,
		InputField,
		MetricCard,
		Card,
		Tabs,
		DataTable,
		Alert,
		snackStore,
		type TabItem,
	} from '@aryagg/ui-kit';
	import { ESize, ETheme, EInputType, EDataType, type IMenu } from '@aryagg/types';
	import {
		Grid3x3GapFill,
		JournalBookmarkFill,
		PeopleFill,
		BarChartFill,
		GearFill,
		PlusLg,
		Building,
		Folder2Open,
		Clock,
	} from 'svelte-bootstrap-icons';

	let theme = $state(ETheme.LIGHT);
	let sidebarCollapsed = $state(false);

	// ── Topbar ──────────────────────────────────────────────────────
	const topMenus: IMenu[] = [
		{ id: 'dashboard', label: 'Dashboard', href:"/", selected: true },
		{ id: 'courses', label: 'Courses' },
		{ id: 'reports', label: 'Reports' },
	];

	const profileItems: IMenu[] = [
		{ id: 'profile', label: 'Your profile' },
		{ id: 'settings', label: 'Settings' },
		{ id: 'divider', label: '' },
		{ id: 'logout', label: 'Sign out' },
	];

	// ── Sidebar ─────────────────────────────────────────────────────
	const sidebarMenus: IMenu[] = [
		{ id: 'overview', label: 'Overview', icon: Grid3x3GapFill, selected: true },
		{
			id: 'catalog',
			label: 'Catalog',
			icon: JournalBookmarkFill,
			divider: true,
			children: [
				{ id: 'all-courses', label: 'All courses' },
				{ id: 'categories', label: 'Categories' },
			],
		},
		{ id: 'students', label: 'Students', icon: PeopleFill },
		{ id: 'reports', label: 'Reports', icon: BarChartFill },
		{ id: 'settings', label: 'Settings', icon: GearFill },
	];

	// ── Tabs + table ────────────────────────────────────────────────
	const studentTabs: TabItem[] = [
		{ id: 'active', label: 'Active', badge: 4 },
		{ id: 'invited', label: 'Invited', badge: 2 },
	];
	let activeTab = $state('active');

	const studentColumns = [
		{ key: 'name', label: 'Name', sortable: true, type: EDataType.STRING },
		{ key: 'course', label: 'Course', sortable: true, type: EDataType.STRING },
		{ key: 'progress', label: 'Progress', type: EDataType.STRING },
		{ key: 'enrolled', label: 'Enrolled', sortable: true, type: EDataType.DATE },
	];
	const activeStudents = [
		{
			name: 'Sarah Chen',
			course: 'Structural Design 101',
			progress: '82%',
			enrolled: '2026-05-12',
		},
		{
			name: 'Marcus Weber',
			course: 'BIM Coordination',
			progress: '64%',
			enrolled: '2026-04-30',
		},
		{
			name: 'Aisha Khan',
			course: 'Site Safety Basics',
			progress: '97%',
			enrolled: '2026-03-18',
		},
		{
			name: 'David Kim',
			course: 'Structural Design 101',
			progress: '45%',
			enrolled: '2026-06-02',
		},
	];
	const invitedStudents = [
		{ name: 'Elena Rossi', course: 'BIM Coordination', progress: '—', enrolled: '2026-07-20' },
		{
			name: 'Tom Fischer',
			course: 'Site Safety Basics',
			progress: '—',
			enrolled: '2026-07-22',
		},
	];

	// ── Form ────────────────────────────────────────────────────────
	let courseName = $state('');
	let category = $state('architecture');

	function handleSave() {
		snackStore.showSuccess(courseName ? `"${courseName}" saved.` : 'Course saved.');
	}
</script>

<svelte:head>
	<title>Component showcase</title>
</svelte:head>

<div class="bg-surface-tertiary text-primary flex h-screen w-screen flex-col overflow-hidden">
	<Topbar
		brand="Skeleton Project"
		brandHref="#"
		menus={topMenus}
		activeHref="#"
		searchField={{
			id: 'showcase-search',
			key: 'search',
			label: '',
			placeholder: 'Search courses…',
			type: EInputType.SEARCH,
		}}
		userName="Jordan Lee"
		profileLabel="Jordan Lee"
		{profileItems}
		showThemeToggle
		bind:theme
	/>

	<div class="flex min-h-0 flex-1">
		<CollapsibleSidebar menus={sidebarMenus} bind:collapsed={sidebarCollapsed}>
			{#snippet headerSlot()}
				<span class="text-primary text-sm font-bold">Skeleton Project</span>
			{/snippet}
		</CollapsibleSidebar>

		<main class="min-w-0 flex-1 overflow-y-auto p-6">
			<div class="mx-auto space-y-6">
				<!-- Page header -->
				<div class="flex flex-wrap items-center justify-between gap-3">
					<div>
						<h1 class="text-primary text-xl font-bold">Course dashboard</h1>
						<p class="text-secondary mt-0.5 text-sm">
							layout-kit chrome (Topbar + CollapsibleSidebar) wrapping ui-kit
							components.
						</p>
					</div>
					<Button
						label="New course"
						icon={PlusLg}
						onclick={() => snackStore.showInfo('Open the course builder.')}
					/>
				</div>

				<Alert variant="info" title="Sample page" dismissible>
					This route is a reference for wiring <strong>@aryagg/layout-kit</strong> and
					<strong>@aryagg/ui-kit</strong> together — it is not linked from any navigation.
				</Alert>

				<!-- Metrics: atoms Card, exported as MetricCard, variant="metric" -->
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
					<MetricCard
						variant="metric"
						eyebrow="Active courses"
						value="128"
						trend="up"
						trendLabel="+6 this month"
						tone="accent"
						icon={JournalBookmarkFill}
						chartValues={[40, 44, 42, 48, 51, 49, 55, 58, 60, 63]}
						interactive
					/>
					<MetricCard
						variant="metric"
						eyebrow="Students"
						value="4,392"
						trend="up"
						trendLabel="+212 this week"
						tone="success"
						icon={PeopleFill}
						chartValues={[20, 24, 22, 28, 31, 29, 37, 41, 39, 45]}
						interactive
					/>
					<MetricCard
						variant="metric"
						eyebrow="Completion rate"
						value="76%"
						trend="up"
						trendLabel="+3 pts"
						tone="info"
						icon={Building}
						chartValues={[60, 62, 61, 64, 66, 65, 70, 72, 74, 76]}
						interactive
					/>
					<MetricCard
						variant="metric"
						eyebrow="At risk"
						value="9"
						trend="down"
						trendLabel="-2 vs last week"
						tone="warning"
						icon={Clock}
						chartValues={[15, 14, 13, 12, 11, 10, 9, 10, 9, 9]}
						interactive
					/>
				</div>

				<div class="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
					<!-- MetricCard variant="panel" behaves like a plain content panel -->
					<MetricCard variant="panel" title="Students">
						<Tabs tabs={studentTabs} bind:active={activeTab}>
							<DataTable
								columns={studentColumns}
								rows={activeTab === 'active' ? activeStudents : invitedStudents}
								searchable
								pageSize={5}
							/>
						</Tabs>
					</MetricCard>

					<MetricCard
						variant="panel"
						title="Quick access"
						badge="2 pinned"
						icon={Folder2Open}
					>
						<ul class="divide-border-primary divide-y text-sm">
							<li class="flex items-center gap-3 py-2.5">
								<Avatar name="Sarah Chen" size={ESize.XS} status="online" />
								<div class="min-w-0 flex-1">
									<div class="truncate font-medium">Structural Design 101</div>
									<div class="text-tertiary text-[10px]">42 students</div>
								</div>
								<Badge variant="success" size={ESize.XS}>82%</Badge>
							</li>
							<li class="flex items-center gap-3 py-2.5">
								<Avatar name="Marcus Weber" size={ESize.XS} status="away" />
								<div class="min-w-0 flex-1">
									<div class="truncate font-medium">BIM Coordination</div>
									<div class="text-tertiary text-[10px]">28 students</div>
								</div>
								<Badge variant="amber" size={ESize.XS}>64%</Badge>
							</li>
						</ul>
					</MetricCard>
				</div>

				<!-- molecules Card: a different, simpler component from the same package.
				     Unlike MetricCard, its content goes through named snippet props. -->
				<Card
					variant="outlined"
					padding="lg"
					title="Add a course"
					subtitle="InputField + Button"
				>
					{#snippet childrenSlot()}
						<div class="grid gap-4 sm:grid-cols-2">
							<InputField
								label="Course name"
								bind:value={courseName}
								placeholder="e.g. Site Safety Basics"
							/>
							<InputField
								label="Category"
								type="select"
								bind:value={category}
								options={[
									{ label: 'Architecture', value: 'architecture' },
									{ label: 'Structural', value: 'structural' },
									{ label: 'Safety', value: 'safety' },
								]}
							/>
						</div>
					{/snippet}
					{#snippet footerSlot()}
						<Button label="Save course" onclick={handleSave} />
					{/snippet}
				</Card>
			</div>
		</main>
	</div>
</div>
