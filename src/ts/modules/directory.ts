/** Enhance the complete, server-rendered directory without requiring JavaScript to read it. */
export function initDirectory(): void {
  const directory = document.querySelector<HTMLElement>('[data-directory]');
  if (!directory) return;
  const controls = directory.querySelector<HTMLElement>('.directory-tools');
  const search = directory.querySelector<HTMLInputElement>('input[type="search"]');
  const buttons = directory.querySelectorAll<HTMLButtonElement>('[data-filter]');
  const cards = Array.from(directory.querySelectorAll<HTMLElement>('.platform-card'));
  const count = directory.querySelector<HTMLElement>('.results-count');
  const empty = directory.querySelector<HTMLElement>('.empty-state');
  if (!controls || !search || !count || !empty) return;
  let category = 'All';
  const update = (): void => {
    const query = search.value.trim().toLocaleLowerCase();
    let visible = 0;
    cards.forEach((card) => {
      const categoryMatch = category === 'All' || card.dataset.category === category;
      const searchableText =
        `${card.dataset.category ?? ''} ${card.textContent ?? ''}`.toLocaleLowerCase();
      const queryMatch = searchableText.includes(query);
      card.hidden = !(categoryMatch && queryMatch);
      if (!card.hidden) visible += 1;
    });
    buttons.forEach((button) => {
      const selected = button.dataset.filter === category;
      button.setAttribute('aria-pressed', String(selected));
      button.classList.toggle('active', selected);
    });
    count.textContent = `${visible} of ${cards.length} platforms and publications`;
    empty.hidden = visible > 0;
  };
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      category = button.dataset.filter ?? 'All';
      update();
    });
  });
  search.addEventListener('input', update);
  directory.querySelector('[data-reset]')?.addEventListener('click', () => {
    category = 'All';
    search.value = '';
    update();
    search.focus();
  });
  controls.hidden = false;
}
