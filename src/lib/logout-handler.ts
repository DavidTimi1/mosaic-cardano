
let _logoutFuntion: () => void;

export const registerLogout = (func: (isForced?: boolean) => void) => {
    _logoutFuntion = () => { func(true) };
}

export const triggerLogout = () => {
    _logoutFuntion?.();
}