import { initTheme } from './modules/theme';
import { initMobileNav, setActiveNavLink } from './modules/navigation';
import { initDirectory } from './modules/directory';

document.documentElement.classList.add('js');
initTheme();
initMobileNav();
setActiveNavLink();
initDirectory();
