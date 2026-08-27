# React / TypeScript / JavaScript — Interview Answers

Each answer has a **30-second version** (say this first) and a **deeper version** (go here if they probe). Speak the short version, then pause — let them pull the detail out of you.

---

## 1. How does React's reconciliation algorithm work?

**30-second version**
When state or props change, React re-runs the component and produces a new tree of React elements (the virtual DOM). Reconciliation is the process of diffing that new tree against the previous one to work out the minimum set of DOM changes. A full tree diff is O(n³), so React uses two heuristics to make it O(n): elements of different types produce completely different trees, and keys tell React which children are stable across renders.

**Deeper version**
- **Different element type** (`<div>` → `<span>`, or `ComponentA` → `ComponentB`): React tears down the old subtree (unmounting, losing state) and builds the new one from scratch.
- **Same type**: React keeps the DOM node/component instance, updates only the changed attributes/props, and recurses into children. State is preserved.
- **Lists**: without keys React matches children by index, so inserting at the top re-renders every item and can corrupt state (input values move to the wrong row). A stable key (an ID, not the array index) lets React match items across renders and just move DOM nodes.
- Reconciliation is the **render phase** — it only computes a list of effects. The **commit phase** then applies them to the real DOM synchronously and runs `useLayoutEffect`/`useEffect`.
- Since React 16 the reconciler is **Fiber** (question 2), which lets this diffing work be split up and interrupted.

**Practical thing to mention:** "The most common bug I've fixed related to this is index-as-key on a list that gets reordered or filtered — the form state jumps between rows. Switching to a stable ID fixes it."

---

## 2. What are React Fiber and concurrent rendering?

**30-second version**
Fiber is the reconciler React has used since v16. Instead of recursing through the component tree in one uninterruptible call stack, each component becomes a "fiber" — a plain JS object that represents a unit of work. React can process fibers one at a time, pause, prioritise, resume, or throw away the work. That architecture is what makes concurrent rendering (React 18) possible: React can start rendering an update, interrupt it for something more urgent like a keystroke, and come back later.

**Deeper version**
- A fiber holds the component type, props, state, and pointers: `child`, `sibling`, `return` (parent). That linked-list shape is what lets React stop mid-tree and resume — you can't do that with a recursive call stack.
- React keeps two trees: the **current** tree (what's on screen) and a **work-in-progress** tree. It builds the WIP tree during the render phase and swaps pointers in the commit phase.
- **Render phase is interruptible and may run multiple times** — this is why render functions must be pure and side effects live in `useEffect`.
- **Concurrent features** (enabled with `createRoot` in React 18):
  - Automatic batching of state updates everywhere (not just in event handlers).
  - `startTransition` / `useTransition` — mark an update as non-urgent so typing stays responsive while a big list filters.
  - `useDeferredValue` — render with a stale value first, then the fresh one.
  - `Suspense` for data fetching and streaming SSR.
- Time slicing: React yields back to the browser roughly every 5ms so the main thread can paint and handle input.

**Example to give:** "We had a search box over a 10k-row table. Every keystroke froze the input. Wrapping the filter state update in `startTransition` kept typing instant and let the table catch up."

---

## 3. CSR vs SSR vs SSG

**30-second version**
They differ in *where and when* HTML is produced. CSR ships an empty shell and the browser builds the page from JS. SSR renders HTML on the server per request, then the client hydrates it. SSG renders HTML once at build time and serves static files from a CDN. Trade-off is first-paint speed and SEO versus server cost and data freshness.

| | CSR | SSR | SSG |
|---|---|---|---|
| HTML generated | In browser | Server, per request | Build time |
| First paint | Slow (download + execute JS) | Fast | Fastest |
| SEO | Weak without prerendering | Good | Good |
| Data freshness | Live | Live | Stale until rebuild (ISR helps) |
| Server cost | Minimal | Per-request compute | None (CDN) |
| Good for | Auth'd dashboards, internal tools | E-commerce, content with SEO + personalisation | Docs, marketing, blogs |

**Deeper version**
- SSR pitfall: **hydration** — the HTML is visible before the JS loads, so there's a gap where buttons don't work (FCP vs TTI). Streaming SSR with Suspense in React 18 shrinks that.
- SSR bugs: anything using `window` or `localStorage` at render time crashes on the server; mismatched markup causes hydration warnings.
- **ISR** (Incremental Static Regeneration) in Next.js regenerates static pages on a timer — a middle ground.
- **React Server Components** are a newer split: components that run only on the server, ship zero JS, and can access the DB directly.
- For a bank-style internal app behind login, CSR with a Spring Boot API is usually the right call; SSR adds ops complexity for little gain.

---

## 4. When would you use `useRef` instead of `useState`?

**30-second version**
`useState` is for values the UI depends on — changing it triggers a re-render. `useRef` gives you a mutable box that persists across renders *without* triggering one. If changing the value should not repaint anything, it belongs in a ref.

**Typical ref use cases**
- DOM references: focusing an input, measuring an element, integrating a non-React library (chart, map).
- Timer / interval IDs so you can clear them in cleanup.
- Storing the previous value of a prop or state.
- Tracking "is mounted" or "has this effect already run".
- Holding the latest callback so a long-lived subscription doesn't have a stale closure.
- Counters or flags used inside handlers but never displayed.

```jsx
function SearchBox({ onSearch }) {
  const [query, setQuery] = useState("");       // shown in the input → state
  const debounceRef = useRef(null);             // timer id → ref

  const handleChange = (e) => {
    setQuery(e.target.value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearch(e.target.value), 300);
  };
  return <input value={query} onChange={handleChange} />;
}
```

**Gotcha to mention:** reading `ref.current` during render is unreliable because React doesn't know it changed — refs are for event handlers and effects.

---

## 5. Explain `React.memo` and scenarios where it can hurt performance

**30-second version**
`React.memo` wraps a component and skips re-rendering it when its props are shallowly equal to the last render. It helps when a component is expensive to render and its props are stable. It hurts when the comparison always fails — then you pay for the prop comparison *and* the render.

**Where it hurts**
1. **Props change every render anyway** — inline objects, arrays, arrow functions, or `children` JSX are new references each time, so memo never hits. You need `useCallback`/`useMemo` upstream to make it work, which adds its own cost.
2. **Cheap components** — comparing 10 props can cost more than rendering a `<span>`.
3. **Custom comparator done wrong** — deep-equal on large objects is expensive; a comparator that ignores a prop leaves stale UI on screen.
4. **Memory** — memoized results are retained; on huge lists that adds up.
5. **Complexity** — sprinkling memo everywhere makes code harder to reason about with no measured benefit.

**How I decide:** profile first with React DevTools Profiler, memo the components that show up as expensive with stable props, and pair with `useCallback` for callbacks passed down. Also worth mentioning the **React Compiler** (React 19 era) which auto-memoizes, reducing the need to hand-place `memo`.

---

## 6. How do custom hooks improve reusability and maintainability?

**30-second version**
A custom hook extracts stateful logic — not UI — into a function that other components can call. Each call gets its own isolated state, so you get reuse without sharing state accidentally. It replaces the nesting problems of HOCs and render props and keeps components focused on rendering.

**Maintainability benefits**
- **Single responsibility**: `useDebounce`, `useFetch`, `usePagination`, `useAuth`, `usePermissions` — each does one thing, so bugs are found in one place.
- **Cross-cutting concerns** (error handling, retries, analytics, feature flags) live once instead of in 40 components.
- **Testable in isolation** with `@testing-library/react`'s `renderHook`.
- **Composable**: a `useOrders` hook can be built from `useAuth` + `useQuery`.
- **Readable components**: the component reads like a description of the UI, not a wall of `useEffect`.

```jsx
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// usage
const debouncedQuery = useDebounce(query);
```

**Caveat to show judgement:** don't extract a hook for something used once; premature abstraction hurts more than duplication.

---

## 7. What causes unnecessary re-renders and how do you prevent them?

**30-second version**
By default a component re-renders whenever its parent re-renders, whenever its own state changes, or whenever a context it consumes changes — regardless of whether its props actually changed. Most waste comes from state living too high in the tree, unstable prop references, and oversized contexts.

**Causes → fixes**

| Cause | Fix |
|---|---|
| Parent re-renders, children follow | Colocate state lower; or pass content as `children` so it's created by the parent that doesn't re-render ("lift content up") |
| New object/array/function props each render | `useMemo` / `useCallback`, then `React.memo` on the child |
| Context value changes → every consumer re-renders | Split contexts (auth vs theme vs settings); memoize the value object; or use a store with selectors (Zustand, Redux `useSelector`) |
| `setState` with a new object equal in content | Bail out when unchanged; use primitives where possible (React uses `Object.is`) |
| Index as key on reorderable lists | Stable IDs |
| Global store where component subscribes to the whole state | Fine-grained selectors |
| Effects that set state on every render | Fix dependency arrays |

**Process:** React DevTools Profiler → "Highlight updates" → find the hot component → apply the narrowest fix. Mention that premature memoization is itself a smell; measure first.

---

## 8. How would you implement RBAC in a React application?

**30-second version**
The backend is the source of truth — the API enforces authorization on every call. In React, RBAC is about UX: don't show routes, buttons, or menus the user can't use, and handle 403 gracefully. I get the user's roles/permissions from the JWT claims or a `/me` endpoint, keep them in an auth context, and gate routes and components through a small set of reusable pieces.

**Implementation**
1. **Get permissions**: decode the JWT (or call `/me` after login) → `{ roles: ["ADMIN"], permissions: ["orders:read", "orders:write"] }`. Prefer checking **permissions**, not roles — roles change, permissions are what the UI actually needs.
2. **AuthProvider** holds user + permissions; `useAuth()` / `usePermission()` hooks read it.
3. **ProtectedRoute** wraps routes and redirects to login (401) or an "Unauthorized" page (403).
4. **`<Can>` component** for conditional rendering of buttons/sections.
5. **Code-split** admin routes with `React.lazy` so the code isn't even shipped to non-admins.
6. **API layer**: axios interceptor attaches the token; on 401 refresh or log out; on 403 show a toast, don't retry.
7. **Token storage**: httpOnly cookie if possible; if it must be in JS, keep the access token in memory and the refresh token in an httpOnly cookie.

```jsx
const AuthContext = createContext(null);

export function usePermission() {
  const { permissions } = useContext(AuthContext);
  return (perm) => permissions.includes(perm);
}

export function Can({ perform, children, fallback = null }) {
  const can = usePermission();
  return can(perform) ? children : fallback;
}

export function ProtectedRoute({ perform, children }) {
  const { user } = useContext(AuthContext);
  const can = usePermission();
  if (!user) return <Navigate to="/login" replace />;
  if (perform && !can(perform)) return <Navigate to="/403" replace />;
  return children;
}

// routes
<Route path="/admin" element={
  <ProtectedRoute perform="admin:access"><AdminPage /></ProtectedRoute>
} />

// inside a page
<Can perform="orders:write"><button>Create order</button></Can>
```

**Say this line:** "Hiding a button is not security. Every endpoint still checks the token's scopes server-side — the React side just avoids showing the user a door they can't open."

---

## 9. Redux Toolkit vs Context API vs TanStack Query

**30-second version**
They solve different problems. Context is a dependency-injection mechanism for values that rarely change — it's not a state manager. Redux Toolkit manages complex *client* state with predictable updates and dev tooling. TanStack Query manages *server* state — caching, background refetching, deduplication, retries — which is most of the "state" in a typical app. The key insight is separating server state from client state.

| | Context API | Redux Toolkit | TanStack Query |
|---|---|---|---|
| Purpose | Pass values down the tree | Global client state | Server/async state |
| Best for | Theme, locale, auth user, DI | Complex UI state, multi-step flows, undo/redo, cross-feature state | Anything fetched from an API |
| Re-render control | Poor — all consumers re-render | Good — `useSelector` slices | Good — per-query subscriptions |
| Caching / refetch | None | Manual (RTK Query adds it) | Built-in: staleTime, gcTime, refetch on focus/reconnect, dedupe |
| Devtools | No | Excellent | Yes |
| Boilerplate | Minimal | Low with RTK (slices, `createAsyncThunk`) | Minimal |
| Async | DIY | Thunks / RTK Query | Native |

**My typical stack:** TanStack Query for all server data + Context (or Zustand) for the small amount of true client state (auth, theme, modals). I reach for Redux Toolkit when the app has lots of complex, interdependent client state that many features touch — or when the team already has it and the devtools/middleware matter. RTK Query is a reasonable alternative to TanStack Query if you're already in Redux.

---

## 10. How do TypeScript Generics help in large-scale applications?

**30-second version**
Generics let you write code that's reusable across types without losing type safety — the alternative is `any`, which throws away the compiler's help exactly where large codebases need it most. In practice they let API clients, hooks, components, and utilities be written once and still give full autocomplete and compile-time errors at every call site.

**Where they pay off at scale**
- **API contracts**: one `ApiResponse<T>` shape, one `fetchJson<T>()` client — every endpoint gets a typed result.
- **Generic hooks**: `useFetch<Order[]>('/orders')` returns `data: Order[] | undefined`.
- **Generic components**: `<Table<User> rows={users} columns={cols} />` — columns are checked against `User`'s keys.
- **Constraints** (`T extends { id: string }`) let a function require what it needs and nothing more.
- **Refactor safety**: change a domain type in one place, the compiler finds every broken usage across 500 files.
- **Inference**: callers usually don't even write the type argument.

```ts
interface ApiResponse<T> { data: T; status: number; errors?: string[] }

async function get<T>(url: string): Promise<ApiResponse<T>> {
  const res = await fetch(url);
  return res.json();
}

const orders = await get<Order[]>('/api/orders');   // orders.data is Order[]

function useEntity<T extends { id: string }>(items: T[]) {
  const byId = useMemo(() => new Map(items.map(i => [i.id, i])), [items]);
  return (id: string): T | undefined => byId.get(id);
}

type Column<T> = { key: keyof T; header: string; render?: (row: T) => ReactNode };
function Table<T>({ rows, columns }: { rows: T[]; columns: Column<T>[] }) { /* ... */ }
```

---

## 11. Utility types: `Partial`, `Pick`, `Omit`, `Record`

**30-second version**
They're built-in mapped types that derive new types from existing ones so you don't hand-write near-duplicate interfaces. `Partial` makes every property optional, `Pick` keeps a subset, `Omit` removes a subset, `Record` builds an object type from a key union and a value type.

```ts
interface User {
  id: string; name: string; email: string; role: 'ADMIN' | 'USER'; createdAt: Date;
}

// Partial — update/PATCH payloads, form drafts
function updateUser(id: string, patch: Partial<User>) { /* ... */ }

// Pick — a narrow view/DTO
type UserSummary = Pick<User, 'id' | 'name'>;

// Omit — creation payload without server-generated fields
type CreateUserRequest = Omit<User, 'id' | 'createdAt'>;

// Record — lookup maps and dictionaries
type Role = User['role'];
const permissionsByRole: Record<Role, string[]> = {
  ADMIN: ['orders:read', 'orders:write'],
  USER:  ['orders:read'],
};
const usersById: Record<string, User> = {};
```

**Show depth — they're just mapped types:**
```ts
type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
type MyOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
type MyRecord<K extends keyof any, V> = { [P in K]: V };
```

Others worth naming: `Required`, `Readonly`, `ReturnType`, `Parameters`, `NonNullable`, `Extract`/`Exclude`, `Awaited`.

---

## 12. The JavaScript event loop, microtasks and macrotasks

**30-second version**
JavaScript runs on a single thread with a call stack. Async work (timers, network, I/O) is handed to the host — browser or Node — and when it's done, a callback is queued. The event loop's job is: when the stack is empty, take the next task from a queue and run it. There are two kinds of queue: the **microtask queue** (promise callbacks, `queueMicrotask`, `MutationObserver`) which is drained *completely* after every task, and the **macrotask queue** (`setTimeout`, `setInterval`, I/O, UI events) where only one task runs per loop iteration.

**Order of one iteration**
1. Run the current macrotask (initially: the script itself).
2. Drain **all** microtasks — including ones queued by other microtasks.
3. Browser may render (style, layout, paint).
4. Take the next macrotask. Repeat.

```js
console.log('1 sync');
setTimeout(() => console.log('5 timeout (macrotask)'), 0);
Promise.resolve().then(() => console.log('3 promise (microtask)'));
queueMicrotask(() => console.log('4 queueMicrotask'));
console.log('2 sync');
// Output: 1, 2, 3, 4, 5
```

```js
setTimeout(() => console.log('A timeout'), 0);
Promise.resolve()
  .then(() => { console.log('B then1'); setTimeout(() => console.log('D timeout in then'), 0); })
  .then(() => console.log('C then2'));
// B, C, A, D — both microtasks run before ANY timeout, even the one queued first
```

**Practical implications**
- `async/await` is sugar over promises: everything after an `await` is a microtask.
- A microtask that keeps queueing microtasks **starves rendering** — the page freezes; `setTimeout` yields to the browser, `Promise.then` does not.
- `setTimeout(fn, 0)` is "after the current task and all microtasks, and at least ~4ms when nested".
- Node adds `process.nextTick` (runs before promise microtasks) and `setImmediate` (check phase, after I/O).
- In React: state updates in event handlers are batched; `flushSync` forces a sync commit; effects run after paint (`useEffect`) or before (`useLayoutEffect`).

---

## 13. API caching, retries, and background synchronisation

**30-second version**
I'd lean on a server-state library (TanStack Query or RTK Query) rather than hand-rolling. Caching is keyed by query key with a `staleTime` that says how long data is fresh; retries use exponential backoff with jitter and only for retryable errors; background sync comes from refetch-on-focus/reconnect/interval plus push-based invalidation over WebSocket or SSE. On top of that sits an HTTP layer with an interceptor for auth refresh and `AbortController` for cancellation.

**Caching**
- Query cache: `staleTime` (fresh window, no refetch) vs `gcTime` (how long unused data is kept). Show cached data instantly, revalidate in background (stale-while-revalidate).
- Request **deduplication**: five components asking for `/me` = one network call.
- HTTP-level: respect `Cache-Control`/`ETag` so the browser/CDN can return 304.
- Persist cache to storage (`persistQueryClient`) for instant reload / offline reads.
- Cache **invalidation** on mutation: `invalidateQueries(['orders'])` after creating an order.

**Retries**
- Only retry **network errors, 5xx, 429, 408** — never 4xx like 400/401/403/404.
- Exponential backoff with jitter: 1s, 2s, 4s (cap ~30s), 3 attempts max.
- Honour `Retry-After`.
- Retrying non-idempotent POSTs requires an **Idempotency-Key** header so the server dedupes; otherwise don't retry them automatically.
- 401 → single refresh-token attempt via interceptor, queue concurrent requests, replay, else log out.

**Background synchronisation**
- `refetchOnWindowFocus`, `refetchOnReconnect`, `refetchInterval` for dashboards.
- **Push**: WebSocket/SSE message → `invalidateQueries` or `setQueryData` to patch the cache directly.
- **Optimistic updates** for mutations: update cache immediately, roll back on failure.
- **Offline writes**: queue mutations (TanStack `onlineManager` + persisted mutation cache, or a service worker with the Background Sync API), replay on reconnect in order, dedupe by client-generated ID.
- Cancel in-flight requests when the component unmounts or the query changes (`AbortController`).

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: (count, err) => count < 3 && isRetryable(err),
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000) + Math.random() * 500,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});

function useOrders() {
  return useQuery({ queryKey: ['orders'], queryFn: ({ signal }) => api.get('/orders', { signal }) });
}

function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (order) => api.post('/orders', order, { headers: { 'Idempotency-Key': order.clientId } }),
    onMutate: async (order) => {
      await qc.cancelQueries({ queryKey: ['orders'] });
      const prev = qc.getQueryData(['orders']);
      qc.setQueryData(['orders'], (old = []) => [...old, { ...order, status: 'PENDING' }]);
      return { prev };
    },
    onError: (_e, _v, ctx) => qc.setQueryData(['orders'], ctx.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
}
```

---

## 14. Design a scalable notification system for a React app with ~1K users

**30-second version**
1K users is small — one backend instance and one WebSocket/SSE server handle that easily — so the design goal is correctness and a clean path to scale, not raw throughput. I'd have a notification service that persists every notification, delivers in real time over SSE (or WebSocket if I need two-way), and falls back to polling. The React side has a `NotificationProvider` that keeps the list and unread count in TanStack Query, prepends real-time events, and handles reconnect by fetching anything missed.

**Architecture**

```
Domain events (order created, comment, alert)
        │  (Kafka / SNS / direct call)
        ▼
Notification Service (Spring Boot)
  ├─ builds notification, checks user preferences
  ├─ persists: notifications(id, userId, type, title, body, link, readAt, createdAt)
  ├─ publishes to Redis pub/sub channel "user:{id}"  ← only needed once >1 instance
  └─ optional channels: email, web push, SMS (via queue, async)
        │
        ▼
Realtime Gateway (SSE endpoint /notifications/stream, or WebSocket)
  ├─ authenticates JWT on connect
  ├─ holds userId → connection map
  └─ pushes JSON events to connected user
        │
        ▼
React app
  ├─ NotificationProvider (context) → useNotifications()
  ├─ TanStack Query: GET /notifications?cursor=..., GET /notifications/unread-count
  ├─ EventSource / WebSocket → on message: setQueryData (prepend) + bump count + toast
  ├─ Mutations: mark read (optimistic), mark all read
  └─ UI: bell + badge, dropdown list, toast, full "notification centre" page
```

**Backend decisions**
- **SSE vs WebSocket**: SSE is enough for server→client, works over plain HTTP, auto-reconnects, simpler to run behind an ALB. WebSocket if the client also sends a lot (chat, presence).
- **Persist first, push second** — the DB is the source of truth; the socket is just a fast path. If the push is missed, nothing is lost.
- **Fan-out**: producers publish an event; the notification service decides recipients and formats. Decouples producers from delivery.
- **Preferences**: per user, per notification type, per channel; quiet hours; digest/batching for noisy types.
- **Idempotency**: each notification has an ID; retries and reconnects never duplicate.
- **Retention/TTL**: archive or delete after N days; index on `(userId, createdAt desc)` and `(userId, readAt)`.

**Frontend decisions**
- **Reconnect**: `EventSource` reconnects automatically; send `Last-Event-ID` so the server replays missed events; or on reconnect refetch `?since=lastSeenId`.
- **Fallback**: if the stream fails for N attempts, poll unread-count every 30s.
- **Single connection per tab** — and use `BroadcastChannel` so only one tab holds the socket and shares events with the others.
- **Optimistic mark-as-read** with rollback.
- **Cursor pagination** (not offset) for the list; virtualise if long.
- **Web Push** via service worker for notifications when the tab is closed (user opt-in).
- **Accessibility**: `aria-live="polite"` on the toast region; keyboard navigable list.

**Scaling path (what changes at 100K+ users)**
- Multiple gateway instances: Redis pub/sub (or Kafka) to route "user X got a notification" to whichever instance holds X's connection; or a managed service like AWS API Gateway WebSockets / AppSync.
- Separate the read model (Cassandra/DynamoDB keyed by userId) from the write path.
- Rate-limit noisy producers; batch into digests; move email/push to worker queues with DLQs.
- Metrics: delivery latency, connection count, reconnect rate, unread backlog per user.

```jsx
function useNotificationStream() {
  const qc = useQueryClient();
  useEffect(() => {
    const es = new EventSource('/api/notifications/stream', { withCredentials: true });
    es.onmessage = (e) => {
      const n = JSON.parse(e.data);
      qc.setQueryData(['notifications'], (old) =>
        old?.some(x => x.id === n.id) ? old : [n, ...(old ?? [])]);
      qc.setQueryData(['unreadCount'], (c = 0) => c + 1);
      toast(n.title);
    };
    es.onerror = () => qc.invalidateQueries({ queryKey: ['notifications'] }); // catch-up on reconnect
    return () => es.close();
  }, [qc]);
}
```

**Line to end on:** "For 1K users the honest answer is SSE plus a DB table — I'd resist adding Kafka and Redis until the metrics say I need them, but I'd structure the code so that swapping in a pub/sub layer is a one-class change."
