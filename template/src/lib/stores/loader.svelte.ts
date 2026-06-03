
let showLoader = $state(false);

function show(): void {
    showLoader = true;
}

function hide(): void {
    showLoader = false;
}

export const loaderStore = {
    get isVisible() {
        return showLoader;
    },
    show,
    hide
};
