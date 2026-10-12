/*
  NÉVARA — site settings
  Fill these in before you go live. Anything left empty is hidden or
  shows a friendly "not connected yet" message instead of failing silently.
*/
window.NEVARA_CONFIG = {
    currency: '₦',
    freeDeliveryThreshold: 100000,

    // Orders from the bag are sent to this WhatsApp number.
    // International format, digits only, no "+" or spaces. Example: 2348012345678
    whatsappNumber: '',

    // Contact form + newsletter. Create a free form at https://formspree.io
    // and paste its URL here. Example: https://formspree.io/f/abcdwxyz
    formEndpoint: '',

    // Shown on the Contact page when filled in.
    email: '',
    phone: '',
    address: 'Lagos, Nigeria',

    // Full profile URLs. Empty ones are hidden in the footer.
    social: {
        instagram: '',
        tiktok: '',
        facebook: '',
        x: ''
    }
};
