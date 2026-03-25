/**
 * Event emitter service for cross-component communication.
 * Provides a lightweight pub/sub system without external dependencies.
 */

type EventHandler = (...args: unknown[]) => void;

class EventEmitter {
    private handlers: Map<string, EventHandler[]> = new Map();

    /**
     * Subscribe to an event.
     * @returns Unsubscribe function
     */
    on(event: string, handler: EventHandler): () => void {
        const existing = this.handlers.get(event) || [];
        existing.push(handler);
        this.handlers.set(event, existing);

        return () => {
            const updated = this.handlers.get(event)?.filter(h => h !== handler) || [];
            this.handlers.set(event, updated);
        };
    }

    /**
     * Emit an event with optional arguments.
     */
    emit(event: string, ...args: unknown[]): void {
        const handlers = this.handlers.get(event);
        if (handlers) {
            handlers.forEach(handler => handler(...args));
        }
    }

    /**
     * Remove all handlers for an event.
     */
    off(event: string): void {
        this.handlers.delete(event);
    }

    /**
     * Clear all event handlers.
     */
    clear(): void {
        this.handlers.clear();
    }
}

// Singleton instance for global event bus
export const eventBus = new EventEmitter();

// Predefined event names for type safety
export const EVENTS = {
    POOL_CREATED: 'pool:created',
    BET_PLACED: 'bet:placed',
    POOL_SETTLED: 'pool:settled',
    WALLET_CONNECTED: 'wallet:connected',
    WALLET_DISCONNECTED: 'wallet:disconnected',
    TRANSACTION_SUBMITTED: 'tx:submitted',
    TRANSACTION_CONFIRMED: 'tx:confirmed',
    TRANSACTION_FAILED: 'tx:failed',
} as const;
