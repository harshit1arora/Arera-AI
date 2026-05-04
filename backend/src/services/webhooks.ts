import crypto from 'crypto';
import { db } from '../config/firebase';

export interface WebhookPayload {
  eventId: string;
  eventType: string;
  timestamp: string;
  data: any;
}

/**
 * Generate HMAC-SHA256 signature for webhook payload verification.
 * The client can verify: crypto.createHmac('sha256', secretKey).update(body).digest('hex')
 */
const signPayload = (payload: string, secretKey: string): string => {
  return crypto.createHmac('sha256', secretKey).update(payload).digest('hex');
};

export const dispatchWebhook = async (orgId: string, eventType: string, data: any) => {
  try {
    const webhookDoc = await db.collection('webhooks').doc(orgId).get();
    
    if (!webhookDoc.exists) {
      console.log(`[Webhook] No webhook configured for org ${orgId}. Skipping.`);
      return;
    }

    const { targetUrl, secretKey, isActive } = webhookDoc.data()!;

    if (!isActive || !targetUrl) {
      console.log(`[Webhook] Inactive or missing URL for org ${orgId}.`);
      return;
    }

    const payload: WebhookPayload = {
      eventId: `evt_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`,
      eventType,
      timestamp: new Date().toISOString(),
      data
    };

    const payloadString = JSON.stringify(payload);

    // Compute real HMAC-SHA256 signature
    const signature = signPayload(payloadString, secretKey);

    console.log(`[Webhook] Dispatching ${eventType} to ${targetUrl} for org ${orgId}`);

    fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Arera-Signature': `sha256=${signature}`,
        'X-Arera-Event': eventType,
        'X-Arera-Delivery': payload.eventId,
      },
      body: payloadString
    })
    .then(response => {
      db.collection('webhook_logs').add({
        orgId,
        eventId: payload.eventId,
        eventType,
        targetUrl,
        status: response.status,
        success: response.ok,
        timestamp: new Date()
      }).catch(console.error);

      // Log to audit trail
      db.collection('audit_logs').add({
        orgId,
        action: 'WEBHOOK_DELIVERY',
        detail: `${eventType} → ${targetUrl} [HTTP ${response.status}]`,
        success: response.ok,
        timestamp: new Date()
      }).catch(console.error);
    })
    .catch(error => {
      console.error(`[Webhook] Failed to reach ${targetUrl}:`, error.message);
      
      db.collection('webhook_logs').add({
        orgId,
        eventId: payload.eventId,
        eventType,
        targetUrl,
        status: 0,
        success: false,
        error: error.message,
        timestamp: new Date()
      }).catch(console.error);
    });

  } catch (err) {
    console.error(`[Webhook Error] Org ${orgId}:`, err);
  }
};
