import { beforeEach, describe, expect, it } from 'vitest';
import { initDirectory } from './directory';

describe('Platform directory enhancement', () => {
  beforeEach(() => {
    document.body.innerHTML = `<section data-directory>
      <div class="directory-tools" hidden><button data-filter="All">All</button><button data-filter="Cricket">Cricket</button><input type="search"></div>
      <p class="results-count" aria-live="polite"></p>
      <article class="platform-card" data-category="Cricket">Crickrida IPL analytics</article>
      <article class="platform-card" data-category="Cricket">Cricket Wicket international</article>
      <article class="platform-card" data-category="Learning">GyanGram UPSC</article>
      <div class="empty-state" hidden><button data-reset>Clear filters</button></div>
    </section>`;
  });
  const visibleCards = () => [...document.querySelectorAll<HTMLElement>('.platform-card')].filter((item) => !item.hidden);
  it('keeps all content available before JavaScript enhancement', () => {
    expect(visibleCards()).toHaveLength(3);
    expect(document.querySelector<HTMLElement>('.directory-tools')?.hidden).toBe(true);
    initDirectory();
    expect(document.querySelector<HTMLElement>('.directory-tools')?.hidden).toBe(false);
  });
  it('combines category and search with accessible selection state', () => {
    initDirectory();
    const filter = document.querySelector<HTMLButtonElement>('[data-filter="Cricket"]')!;
    filter.click();
    expect(visibleCards()).toHaveLength(2);
    expect(filter.getAttribute('aria-pressed')).toBe('true');
    const input = document.querySelector('input')!;
    input.value = 'cricket';
    input.dispatchEvent(new Event('input'));
    expect(visibleCards()).toHaveLength(2);
    input.value = '  IPL  ';
    input.dispatchEvent(new Event('input'));
    expect(visibleCards().map((item) => item.textContent)).toEqual(['Crickrida IPL analytics']);
    expect(document.querySelector('.results-count')?.textContent).toBe('1 of 3 platforms and publications');
  });
  it('recovers from no results and returns focus to search', () => {
    initDirectory();
    const input = document.querySelector('input')!;
    input.value = 'no such platform';
    input.dispatchEvent(new Event('input'));
    expect(visibleCards()).toHaveLength(0);
    expect(document.querySelector<HTMLElement>('.empty-state')?.hidden).toBe(false);
    document.querySelector<HTMLButtonElement>('[data-reset]')!.click();
    expect(visibleCards()).toHaveLength(3);
    expect(document.activeElement).toBe(input);
    expect(input.value).toBe('');
  });
});
