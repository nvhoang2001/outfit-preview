import { create } from "zustand";

interface IUser {
	username: string;
}

interface IAuthStore {
	isSignedIn: boolean;
	canUseBiometric: boolean;
	user: IUser | undefined;
	setIsSignedIn: (isSignedIn: boolean) => void;
	setCanUseBiometric: (canUseBiometric: boolean) => void;
	setUser: (user: IUser) => void;
}

const useAuthStore = create<IAuthStore>((set) => ({
	isSignedIn: false,
	canUseBiometric: false,
	user: undefined,
	setIsSignedIn: (isSignedIn: boolean) => set({ isSignedIn }),
	setCanUseBiometric: (canUseBiometric: boolean) => set({ canUseBiometric }),
	setUser: (user: IUser) => set({ user }),
}));

export default useAuthStore;
