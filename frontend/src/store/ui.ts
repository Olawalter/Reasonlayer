import { create } from "zustand";

type ModalId = "connect-wallet" | "confirm-tx" | "register" | null;

interface TxState {
  hash: string;
  status: "pending" | "accepted" | "finalized" | "error";
  method: string;
}

interface UIState {
  sidebarOpen: boolean;
  activeModal: ModalId;
  pendingTx: TxState | null;
  setSidebarOpen: (open: boolean) => void;
  openModal: (id: ModalId) => void;
  closeModal: () => void;
  setPendingTx: (tx: TxState | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activeModal: null,
  pendingTx: null,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),
  setPendingTx: (tx) => set({ pendingTx: tx }),
}));
