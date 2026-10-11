import { enquiryLinks } from '../data/enquiries';

const page = document.querySelector<HTMLElement>('[data-contact-page]');
if (page) {
  const names: string[] = JSON.parse(page.dataset.projectNames || '[]');
  const requested = new URLSearchParams(location.search).get('piece');
  // Only recognised collection names may personalise an enquiry.
  const piece = names.find(name => name === requested);
  if (piece) {
    const links = enquiryLinks(piece);
    const context = page.querySelector<HTMLElement>('[data-enquiry-context]');
    const name = page.querySelector<HTMLElement>('[data-enquiry-name]');
    if (name) name.textContent = piece;
    if (context) context.hidden = false;
    const heading = page.querySelector<HTMLElement>('[data-enquiry-heading]');
    if (heading) heading.textContent = `Let’s talk about ${piece}`;
    document.querySelectorAll<HTMLAnchorElement>('[data-enquiry-email]').forEach(link => {
      link.href = links.email;
    });
    document.querySelectorAll<HTMLAnchorElement>('[data-enquiry-whatsapp]').forEach(link => {
      link.href = links.whatsapp;
      link.setAttribute('aria-label', `Ask Eugene about ${piece} on WhatsApp`);
    });
    const chatLabel = page.querySelector<HTMLElement>('[data-enquiry-chat-label]');
    if (chatLabel) chatLabel.textContent = `Ask about ${piece} on WhatsApp`;
  }
}
