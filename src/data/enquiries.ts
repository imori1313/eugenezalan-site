import { contact } from './projects';

export function enquiryLinks(piece = '') {
  const message = piece
    ? `Hi Eugene, I’m interested in commissioning ${piece}. Could we discuss the price, finishes and delivery?`
    : 'Hi Eugene, I’m interested in discussing a bespoke furniture commission.';
  const subject = piece ? `${piece} — commission enquiry` : 'Furniture commission enquiry';
  return {
    whatsapp: `https://wa.me/${contact.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`,
    email: `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`,
  };
}
