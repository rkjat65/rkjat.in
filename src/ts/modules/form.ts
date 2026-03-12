/**
 * Contact form module
 */

import { getElement } from './utils';

interface FormSubmitResult {
  success: boolean;
  message: string;
}

/**
 * Initialize contact form handling
 */
export function initContactForm(): void {
  const form = getElement<HTMLFormElement>('.contact-form');
  if (!form) return;

  form.addEventListener('submit', (e: Event) => {
    void handleFormSubmit(e);
  });
}

/**
 * Handle form submission
 */
async function handleFormSubmit(e: Event): Promise<void> {
  e.preventDefault();

  const form = e.target as HTMLFormElement;
  const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');

  if (!submitBtn) return;

  const originalText = submitBtn.textContent ?? 'Send Message';

  try {
    // Disable button and show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const result = await submitForm(form);

    if (result.success) {
      showSuccessMessage(form);
    } else {
      showErrorState(submitBtn, originalText);
    }
  } catch {
    showErrorState(submitBtn, originalText);
  }
}

/**
 * Submit form data
 */
async function submitForm(form: HTMLFormElement): Promise<FormSubmitResult> {
  const formData = new FormData(form);
  const action = form.action;

  if (!action) {
    throw new Error('Form action not specified');
  }

  const response = await fetch(action, {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    return {
      success: false,
      message: `HTTP error ${response.status}`,
    };
  }

  return {
    success: true,
    message: 'Message sent successfully',
  };
}

/**
 * Show success message after form submission
 */
function showSuccessMessage(form: HTMLFormElement): void {
  form.innerHTML = `
    <div class="form-success" style="text-align: center; padding: 40px;">
      <p style="font-size: 3rem; margin-bottom: 16px;">✅</p>
      <h3>Message Sent!</h3>
      <p style="color: var(--text-secondary);">I'll get back to you soon.</p>
    </div>
  `;
}

/**
 * Show error state on button
 */
function showErrorState(button: HTMLButtonElement, originalText: string): void {
  button.textContent = 'Error - Try Again';
  button.disabled = false;

  setTimeout(() => {
    button.textContent = originalText;
  }, 2000);
}
