import { create } from "zustand";

type CreateTokenDataType = {
  name: string;
  symbol: string;
  decimal: number;
  description: string;
  image: string;
  formData: FormData | null;
  desired_position: string;
  desired_number_hours: string;
  highlight_token_config: boolean;
  total_cost: number;
};

interface PositionData {
  position: number;
  tokenCount: number;
  totalSlotHours: number;
}

interface State {
  createTokenProgressbarFlag: boolean;
  toggleCreateTokenProgressbarFlag: () => void;
  resetCreateTokenProgressbarFlag: () => void;
  createTokenStep: number;
  setCreateTokenStep: (step: number) => void;
  resetCreateTokenStep: () => void;
  step1Processing: boolean;
  setStep1ProcessingFlag: (flag: boolean) => void;
  step2Processing: boolean;
  setStep2ProcessingFlag: (flag: boolean) => void;
  step3Processing: boolean;
  setStep3ProcessingFlag: (flag: boolean) => void;
  step1Processed: boolean;
  setStep1ProcessedFlag: (flag: boolean) => void;
  step2Processed: boolean;
  setStep2ProcessedFlag: (flag: boolean) => void;
  step3Processed: boolean;
  setStep3ProcessedFlag: (flag: boolean) => void;

  isUserSigned: boolean;
  setUserSignindFlag: (flag: boolean) => void;

  isTrading: boolean;
  setIsTradingFlag: (flag: boolean) => void;

  isCreating: boolean;
  setIsCreating: (flag: boolean) => void;

  createTokenData: CreateTokenDataType;

  setCreateTokenData: (data: CreateTokenDataType) => void;

  isAvailablePosition: boolean;
  setIsAvailablePositionFlag: (flag: boolean) => void;
}

const useStore = create<State>((set, get) => ({
  createTokenProgressbarFlag: false,
  toggleCreateTokenProgressbarFlag: () =>
    set((state: { createTokenProgressbarFlag: boolean }) => ({
      createTokenProgressbarFlag: !state.createTokenProgressbarFlag,
    })),
  resetCreateTokenProgressbarFlag: () =>
    set({ createTokenProgressbarFlag: false }),
  createTokenStep: 0,
  setCreateTokenStep: (step) =>
    set(() => ({
      createTokenStep: step,
    })),
  resetCreateTokenStep: () => set({ createTokenStep: 0 }),
  step1Processing: false,
  setStep1ProcessingFlag: (flag) =>
    set(() => ({
      step1Processing: flag,
    })),
  step2Processing: false,
  setStep2ProcessingFlag: (flag) =>
    set(() => ({
      step2Processing: flag,
    })),
  step3Processing: false,
  setStep3ProcessingFlag: (flag) =>
    set(() => ({
      step3Processing: flag,
    })),
  step1Processed: false,
  setStep1ProcessedFlag: (flag) =>
    set(() => ({
      step1Processed: flag,
    })),
  step2Processed: false,
  setStep2ProcessedFlag: (flag) =>
    set(() => ({
      step2Processed: flag,
    })),
  step3Processed: false,
  setStep3ProcessedFlag: (flag) =>
    set(() => ({
      step3Processed: flag,
    })),
  isUserSigned: false,
  setUserSignindFlag: (flag) =>
    set(() => ({
      isUserSigned: flag,
    })),
  isTrading: false,
  setIsTradingFlag: (flag) =>
    set(() => ({
      isTrading: flag,
    })),
  isCreating: true,
  setIsCreating: (flag) =>
    set(() => ({
      isCreating: flag,
    })),
  createTokenData: {
    name: "",
    symbol: "",
    decimal: 0,
    description: "",
    image: "",
    formData: null,
    desired_position: "",
    desired_number_hours: "",
    highlight_token_config: false,
    total_cost: 0,
  },
  setCreateTokenData: (data) =>
    set(() => ({
      createTokenData: { ...data },
    })),
  isAvailablePosition: false,
  setIsAvailablePositionFlag: (flag) =>
    set(() => ({
      isAvailablePosition: flag,
    })),
}));

export default useStore;
