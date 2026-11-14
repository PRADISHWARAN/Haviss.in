// Notification content never contains attachment bytes or privileged links.
export type EnquiryNotification = {
  id: string; full_name: string; company_name: string; email: string; phone: string;
  city: string; service: string; manufacturer: string; model: string;
  product: string; requirement: string; attachment_path: string | null;
};
export type NotificationConfig = { apiKey: string; from: string; to: string };

export function notificationPayload(enquiry: EnquiryNotification, config: NotificationConfig) {
  return {
    from: config.from,
    to: [config.to],
    reply_to: enquiry.email,
    subject: `Haviss enquiry: ${enquiry.service}`,
    text: [
      `New enquiry ${enquiry.id}`, '', `Name: ${enquiry.full_name}`,
      `Company: ${enquiry.company_name}`, `Email: ${enquiry.email}`,
      `Phone: ${enquiry.phone}`, `Location: ${enquiry.city}`, `Service: ${enquiry.service}`,
      `Machine: ${enquiry.manufacturer} ${enquiry.model}`.trimEnd(),
      `Product: ${enquiry.product || 'Not specified'}`, '', enquiry.requirement, '',
      `Attachment: ${enquiry.attachment_path ? 'Available in the secure staff dashboard' : 'None'}`,
      '', 'Open the staff dashboard to review and update this enquiry.',
    ].join('\n'),
  };
}

export async function sendEnquiryNotification(enquiry: EnquiryNotification, config: NotificationConfig, send: typeof fetch = fetch): Promise<boolean> {
  try {
    const response = await send('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `enquiry-${enquiry.id}` },
      body: JSON.stringify(notificationPayload(enquiry, config)),
      signal: AbortSignal.timeout(10000),
    });
    return response.ok;
  } catch { return false; }
}
