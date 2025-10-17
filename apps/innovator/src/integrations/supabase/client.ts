/**
 * Mock Supabase Client - Backend removed
 * Comprehensive no-op client that supports all Supabase method chaining
 */

const mockUser = { id: 'demo-user-1', email: 'demo@fishtank.app', name: 'Demo User' };
const mockSession = { access_token: 'mock-token', user: mockUser };

const mockAuth = {
  async signIn(email: string, password: string) {
    return { user: mockUser, session: mockSession, error: null };
  },
  async signInWithPassword(credentials: any) {
    return { data: { user: mockUser, session: mockSession }, error: null };
  },
  async signUp(data: any, options?: any) {
    return { data: { user: mockUser, session: mockSession }, error: null };
  },
  async signOut() {
    return { error: null };
  },
  async getSession() {
    return { data: { session: mockSession }, error: null };
  },
  async getUser() {
    return { data: { user: mockUser }, error: null };
  },
  onAuthStateChange(callback: any) {
    // Immediately call with signed-in state
    setTimeout(() => callback('SIGNED_IN', mockSession), 0);
    return { data: { subscription: { unsubscribe: () => {} } } };
  }
};

// Create chainable query builder
function createChainableQuery() {
  const chain: any = {
    select: (columns?: string) => chain,
    insert: (data: any) => chain,
    update: (data: any) => chain,
    upsert: (data: any) => chain,
    delete: () => chain,
    eq: (column: string, value: any) => chain,
    neq: (column: string, value: any) => chain,
    gt: (column: string, value: any) => chain,
    lt: (column: string, value: any) => chain,
    gte: (column: string, value: any) => chain,
    lte: (column: string, value: any) => chain,
    like: (column: string, value: any) => chain,
    ilike: (column: string, value: any) => chain,
    is: (column: string, value: any) => chain,
    in: (column: string, values: any[]) => chain,
    contains: (column: string, value: any) => chain,
    containedBy: (column: string, value: any) => chain,
    range: (from: number, to: number) => chain,
    order: (column: string, options?: any) => chain,
    limit: (count: number) => chain,
    or: (query: string) => chain,
    and: (query: string) => chain,
    not: (column: string, operator: string, value: any) => chain,
    filter: (column: string, operator: string, value: any) => chain,
    match: (query: object) => chain,
    single: async () => ({ data: null, error: null }),
    maybeSingle: async () => ({ data: null, error: null }),
    then: async (resolve: any) => resolve({ data: [], error: null })
  };
  return chain;
}

// Create chainable channel
function createChannel() {
  const channel: any = {
    on: (event: string, filter?: any, callback?: any) => channel,
    subscribe: (callback?: any) => ({ unsubscribe: () => {} }),
    unsubscribe: () => ({})
  };
  return channel;
}

export const supabase = {
  auth: mockAuth,
  from: (table: string) => createChainableQuery(),
  channel: (name: string) => createChannel(),
  storage: {
    from: (bucket: string) => ({
      upload: async () => ({ data: { path: 'mock-path' }, error: null }),
      getPublicUrl: (path: string) => ({ data: { publicUrl: '/placeholder.svg' } }),
      download: async (path: string) => ({ data: null, error: null }),
      remove: async (paths: string[]) => ({ data: null, error: null })
    })
  }
};
