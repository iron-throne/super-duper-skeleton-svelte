export function extractCSSVariables(css: string): Record<string, string> {
	const cleaned = css.replace(/\/\*[\s\S]*?\*\//g, '');
	const vars: Record<string, string> = {};
	const regex = /(--[\w-]+)\s*:\s*([^;]+);/g;
	let m: RegExpExecArray | null;
	while ((m = regex.exec(cleaned)) !== null) {
		if (m[1] && m[2]) vars[m[1].trim()] = m[2].trim();
	}
	return vars;
}
