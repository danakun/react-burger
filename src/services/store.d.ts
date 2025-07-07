// store.d.ts

interface Store {
	// Define the types for the store here
}

declare module './store' {
	const store: Store;
	export default store;
}
