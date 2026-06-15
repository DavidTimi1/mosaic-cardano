export const MODALS = {
  CREATE_PROJECT: 'CREATE_PROJECT',
  PRICING: 'PRICING',
} as const;

export type ModalId = typeof MODALS[keyof typeof MODALS];
