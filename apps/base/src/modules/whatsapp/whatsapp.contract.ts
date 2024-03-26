
export type WAtextObject = {
  preview_url: boolean,
  body: string,
}

export type WhatsappRequest = {
  messaging_product: "whatsapp",
  recipient_type: "individual",
  to: string,
  type: "text",
  text: WAtextObject,
}