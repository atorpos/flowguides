# Java Full Stack — Practice Q&A (Backend, Cloud, Data)

Say the **30-second version** first. Stop. Let them dig. Use the **depth** section when they push.

---

# A. Core Java

## 1. What changed from Java 8 to 11/17 that you actually use?

**30s:** Beyond Java 8's lambdas and streams, the things I use daily are `var` for local inference (10), the built-in `HttpClient` (11), `String` helpers like `isBlank`/`lines`/`strip` (11), `Optional.isEmpty`/`orElseThrow` (10/11), and from 17: records for immutable DTOs, sealed classes for closed hierarchies, text blocks for SQL/JSON, and switch expressions with pattern matching. Under the hood, G1 as default GC, container-aware JVM limits, and the module system.

**Depth**
- Records replace Lombok `@Value` for DTOs; they give `equals/hashCode/toString` and are shallowly immutable.
- Sealed + pattern matching switch = exhaustive handling of a closed set (e.g. `PaymentEvent permits Authorized, Captured, Refunded`).
- `HttpClient` supports HTTP/2 and async via `CompletableFuture`.
- Container awareness (10+): JVM reads cgroup limits so `-Xmx` defaults make sense in Docker; older JDK 8 would see the host's RAM.
- Java 21: virtual threads — huge for thread-per-request Spring apps doing blocking I/O.

## 2. Explain HashMap internals. How is ConcurrentHashMap different from `Collections.synchronizedMap`?

**30s:** HashMap is an array of buckets indexed by the key's hash. Collisions go into a linked list, which converts to a red-black tree once a bucket has 8+ entries, so worst case is O(log n) instead of O(n). When size crosses capacity × 0.75 load factor it doubles and rehashes. `synchronizedMap` wraps every method in a single lock, so it serialises all access. `ConcurrentHashMap` locks per bucket (CAS for inserts into empty bins, `synchronized` on the bin head otherwise) and reads are lock-free, so it scales across cores.

**Depth**
- Hash spreading: `(h ^ (h >>> 16))` to mix high bits into the index.
- Tree bins need keys to be `Comparable` or fall back to identity ordering.
- CHM: no null keys/values; iterators are weakly consistent (no `ConcurrentModificationException`); `size()` is approximate under concurrency; `computeIfAbsent` is atomic per key — don't recursively modify inside it.
- Immutable keys matter: mutating a key after insert makes it unfindable.

## 3. `thenApply` vs `thenCompose`, and how do you handle errors in `CompletableFuture`?

**30s:** `thenApply` maps the result with a plain function — like `map`. `thenCompose` takes a function that returns another `CompletableFuture` and flattens it — like `flatMap`. If you use `thenApply` with an async function you get `CompletableFuture<CompletableFuture<T>>`. For errors, `exceptionally` recovers with a fallback value, `handle` gets both result and exception, and `whenComplete` observes without changing the result. Always pass your own executor for I/O work, otherwise you're on the common ForkJoinPool and one slow dependency starves everything.

**Depth**
- `allOf` returns `CompletableFuture<Void>`; collect results by joining each future afterwards.
- Exceptions are wrapped in `CompletionException`; unwrap the cause.
- Timeouts: `orTimeout` / `completeOnTimeout` (Java 9+).
- With Java 21 virtual threads, a lot of this composition can go back to simple blocking code.

## 4. `volatile` vs `synchronized`. What is happens-before?

**30s:** `volatile` guarantees visibility — every read sees the latest write — and prevents reordering, but it does not make compound operations like `count++` atomic. `synchronized` gives both mutual exclusion and visibility. Happens-before is the Java Memory Model's rule set: if action A happens-before B, B sees A's effects. Unlocking a monitor happens-before a later lock of the same monitor; a volatile write happens-before a subsequent volatile read; `Thread.start` happens-before anything in that thread.

**Depth**
- Use `AtomicInteger`/`LongAdder` for counters; `ReentrantLock` when you need tryLock/fairness/conditions; `ReadWriteLock`/`StampedLock` for read-heavy.
- Double-checked locking needs `volatile` on the instance field.
- Prefer immutability and confining state to one thread over locks.

## 5. How do you diagnose a memory leak or high GC in production?

**30s:** Start with symptoms: rising old-gen after each GC in the heap graph, long pauses, `OutOfMemoryError`. I take a heap dump — `jmap -dump` or `-XX:+HeapDumpOnOutOfMemoryError` — and open it in Eclipse MAT to find dominator trees and retained size by class. Common culprits I've seen: unbounded caches, static collections, listeners not removed, ThreadLocals in thread pools, and unclosed streams/connections. For GC tuning I look at GC logs (`-Xlog:gc*`), check allocation rate, and only then adjust heap or switch collector.

**Depth**
- Tools: `jstat -gcutil`, `jcmd GC.class_histogram`, async-profiler, JFR (Flight Recorder) — low-overhead, safe in prod.
- G1 for balanced throughput/latency; ZGC/Shenandoah for sub-10ms pauses on large heaps.
- In containers set `-XX:MaxRAMPercentage=75` rather than fixed `-Xmx`.
- Thread leaks show up as `unable to create native thread` — check with `jstack`.

## 6. Streams: when do parallel streams hurt?

**30s:** Streams are lazy — intermediate ops build a pipeline, nothing runs until a terminal op. Parallel streams split work across the common ForkJoinPool, which helps for CPU-bound work on large arrays with cheap merging. They hurt when the source is hard to split (LinkedList, iterate), when operations are I/O-bound (you block the shared pool), when the collector is expensive to merge, when order matters, or when data is small — the overhead exceeds the gain.

**Depth**
- `findFirst` vs `findAny` — ordering cost in parallel.
- Side effects inside `map`/`forEach` are a bug in parallel.
- Prefer `mapToInt` primitives to avoid boxing.
- `Collectors.groupingByConcurrent` for parallel grouping.

## 7. The `equals`/`hashCode` contract

**30s:** If two objects are equal, they must have the same hashCode; unequal objects may share a hash. Break it and hash-based collections stop working — a key you just put in can't be found because it's in a different bucket. Both must use the same fields, those fields should be immutable, and `equals` must be reflexive, symmetric, transitive, consistent, and handle null.

**Depth**
- Records generate both correctly.
- JPA entities: use business key or ID once persisted, not all fields; be careful with lazy-loaded relations.
- Don't use mutable fields in a key stored in a `HashSet`.

## 8. Why immutability, and how do you enforce it?

**30s:** Immutable objects are thread-safe for free, safe as map keys, easy to cache, and easier to reason about. I enforce it with final fields, no setters, defensive copies of collections (`List.copyOf`), and records. In services I keep DTOs and events immutable and only let entities/aggregates change through explicit methods.

---

# B. Spring Boot

## 9. How does Spring Boot auto-configuration work?

**30s:** `@SpringBootApplication` includes `@EnableAutoConfiguration`, which imports auto-configuration classes listed in `META-INF/spring/…AutoConfiguration.imports` (older: `spring.factories`). Each is a `@Configuration` guarded by conditions — `@ConditionalOnClass` (library on classpath), `@ConditionalOnMissingBean` (you haven't defined your own), `@ConditionalOnProperty`. So if `spring-boot-starter-data-jpa` is on the classpath and there's a DataSource, you get an EntityManager, and if you define your own bean it backs off.

**Depth**
- Debug with `--debug` or the Actuator `/conditions` endpoint to see positive/negative matches.
- Auto-config runs *after* your own `@Configuration` so `OnMissingBean` works.
- Exclude with `@SpringBootApplication(exclude = …)` or `spring.autoconfigure.exclude`.
- Write your own starter: auto-config module + `@ConfigurationProperties`.

## 10. `@Transactional` — common pitfalls

**30s:** It's proxy-based, so it only works on calls that go through the proxy: public methods called from another bean. Self-invocation (`this.method()`) bypasses it. It rolls back on unchecked exceptions by default but *commits* on checked ones unless you set `rollbackFor`. And catching the exception inside the method swallows the rollback signal. Propagation defaults to `REQUIRED` — join an existing transaction or start one.

**Depth**
- Propagation: `REQUIRES_NEW` (suspend outer, separate commit — audit logs), `NESTED` (savepoint, JDBC only), `MANDATORY`, `SUPPORTS`, `NOT_SUPPORTED`, `NEVER`.
- `readOnly = true` hints the driver and skips dirty checking in Hibernate.
- Isolation is per-transaction; default is DB default.
- Don't call external HTTP/Kafka inside a transaction — use the outbox pattern or `TransactionSynchronization.afterCommit`.
- `@Transactional` on a class applies to all public methods; on an interface, only with interface-based proxies.

## 11. `RestTemplate` vs `WebClient` vs Feign vs `RestClient`; how do you set timeouts?

**30s:** `RestTemplate` is the classic blocking client, now in maintenance mode. `WebClient` is the reactive, non-blocking client and works fine in a servlet app if you `.block()`. `RestClient` (Spring 6.1) is the modern synchronous, fluent replacement for RestTemplate. OpenFeign is declarative — an interface with annotations — and pairs well with Resilience4j. Whatever I use, I always configure connect timeout, read timeout, and a connection pool explicitly; the defaults are effectively infinite and that's how one slow downstream takes your whole service down.

**Depth**
- Timeouts live on the underlying client (Apache HttpClient / Reactor Netty), not just Spring.
- Pool sizing per host; `maxConnectionsPerRoute`.
- Add retries with backoff for idempotent calls only; circuit breaker for repeated failures.
- Propagate correlation IDs and auth headers via interceptors/filters.

## 12. Global exception handling and error contract

**30s:** A `@RestControllerAdvice` with `@ExceptionHandler` methods maps exceptions to a consistent error body — I use RFC 7807 Problem Details (`ProblemDetail` is built into Spring 6): `type`, `title`, `status`, `detail`, `instance`, plus a `correlationId` and field errors for validation. Business exceptions map to 4xx, unexpected ones log at ERROR with the stack and return a generic 500 so we never leak internals.

**Depth**
- Handle `MethodArgumentNotValidException` (400 with field list), `EntityNotFoundException` (404), `AccessDeniedException` (403), `HttpMessageNotReadableException` (400).
- `@Order` if multiple advices.
- Don't wrap everything in `RuntimeException`; make a small hierarchy (`NotFound`, `Conflict`, `Validation`).

## 13. Actuator and Kubernetes probes

**30s:** Actuator exposes `/health`, `/metrics`, `/info`, `/prometheus`. On Kubernetes, Boot auto-creates health groups `/actuator/health/liveness` and `/readiness`. Liveness answers "is the JVM stuck — restart me"; readiness answers "can I take traffic" — it goes DOWN during startup and graceful shutdown so the load balancer stops routing. I don't put downstream DB checks in liveness — if the DB is down, restarting pods doesn't help and causes a restart storm.

**Depth**
- Expose only what's needed: `management.endpoints.web.exposure.include`; separate management port.
- Micrometer + Prometheus + Grafana; custom metrics with `MeterRegistry`.
- `server.shutdown=graceful` + `terminationGracePeriodSeconds` so in-flight requests finish.

## 14. How does Spring Security validate a JWT?

**30s:** With `spring-boot-starter-oauth2-resource-server` I configure the issuer or JWK Set URI; Spring fetches the public keys, validates the signature, `exp`, `iss`, and optionally `aud`, and populates the `SecurityContext` with a `JwtAuthenticationToken`. I add a converter to map claims — roles, scopes, groups — into `GrantedAuthority`s, then use `authorizeHttpRequests` for URL rules and `@PreAuthorize` for method-level checks. Sessions are stateless.

**Depth**
- Filter chain: `BearerTokenAuthenticationFilter` extracts the token; the `JwtDecoder` validates; failures return 401 via the entry point.
- Custom `OncePerRequestFilter` only if the token isn't standard.
- Multiple issuers (ADFS + Okta): `JwtIssuerAuthenticationManagerResolver`.
- Keys rotate — JWKS caching handles it via `kid`.
- Method security: `@EnableMethodSecurity`, `@PreAuthorize("hasAuthority('orders:write')")`.

## 15. How do you test a Spring Boot service?

**30s:** Layered. Pure unit tests with JUnit 5 + Mockito for services. Slice tests — `@WebMvcTest` for controllers with MockMvc, `@DataJpaTest` for repositories. Integration tests with `@SpringBootTest` and Testcontainers for a real Postgres/Oracle/Kafka so I'm not testing against H2 behaviour that differs from prod. External HTTP dependencies are mocked with WireMock. Contract tests with Spring Cloud Contract or Pact where we own both sides.

**Depth**
- `@MockBean` (now `@MockitoBean`) to replace beans in slices.
- Test the security config: `@WithMockUser`, `jwt()` post-processor from `spring-security-test`.
- Keep `@SpringBootTest` count low; they're slow — cache context by keeping config identical.

## 16. N+1 selects and other JPA pitfalls

**30s:** N+1 is one query for the parent list and then one per child collection because of lazy loading. Fix with `JOIN FETCH`, `@EntityGraph`, or a DTO projection query. Other pitfalls: `open-in-view` keeping the session open through the controller (turn it off), `LazyInitializationException` outside a transaction, cascading deletes you didn't intend, offset pagination on large tables, and `findAll()` on a table that grows.

**Depth**
- Enable `hibernate.show_sql`/datasource-proxy in tests and assert query counts.
- `@BatchSize` as a middle ground.
- Use `Slice` instead of `Page` when you don't need total count.
- Sometimes plain JDBC/jOOQ is the right answer.

---

# C. REST API Design

## 17. How do you make a POST idempotent?

**30s:** The client sends an `Idempotency-Key` header — a UUID it generates per logical operation. The server stores the key with the response (or in-progress marker) for a TTL; a retry with the same key returns the stored response instead of creating a duplicate. Store it atomically — a unique constraint on the key or a conditional write in DynamoDB — so two concurrent retries can't both succeed.

**Depth**
- Scope the key to the client/user.
- Return 409 if the same key arrives with a different payload.
- PUT and DELETE are idempotent by definition; design updates as PUT with full state where practical.
- In Kafka consumers, the equivalent is a processed-event-ID table.

## 18. API versioning

**30s:** I prefer additive, backward-compatible changes so I rarely need a new version — add fields, never remove or change meaning. When a break is unavoidable, URL versioning (`/v2/orders`) is the most visible and easiest to route at the gateway; header/media-type versioning is cleaner but harder to test and cache. Whatever the choice: run both versions for a deprecation window, log usage by version, and communicate a sunset date.

## 19. Design a `GET /orders` endpoint properly

**30s:** Resource nouns, plural; filters as query params (`?status=SHIPPED&customerId=`); cursor-based pagination for large or fast-changing data (`?cursor=&limit=`), offset only for small admin lists; explicit `sort=createdAt,desc`; a response envelope with `data`, `nextCursor`; sparse fieldsets if payloads are big; `ETag` for caching; consistent Problem Details errors; correct codes — 200, 201 + `Location` on create, 204 on delete, 400/401/403/404/409/422/429.

**Depth**
- Document with OpenAPI and generate clients from it.
- Rate limit per client at the gateway; return `Retry-After`.
- Bulk operations as `POST /orders:batch` or `/orders/bulk`, returning per-item results (207-style).

## 20. Sync vs async APIs

**30s:** If the work takes longer than a couple of seconds or depends on slow systems, return `202 Accepted` with a job ID and a status endpoint (or a `Location` to poll), and do the work from a queue. Otherwise the client holds a connection open, the load balancer times out, and retries create duplicates. Push completion via webhook/SSE if the client can accept it.

---

# D. Authentication & Authorization

## 21. Which OAuth2 flows do you use and why?

**30s:** Authorization Code with PKCE for anything with a user — web SPA, mobile — because the browser never sees the client secret and PKCE stops code interception. Client Credentials for service-to-service where there's no user. Refresh tokens with rotation to keep access tokens short-lived. Implicit and Resource Owner Password are deprecated and I wouldn't use them.

**Depth**
- Roles: resource owner, client, authorization server, resource server.
- Scopes limit what a token can do; claims describe who.
- OIDC adds the ID token and `/userinfo` on top of OAuth2 — OAuth2 is authorization, OIDC is authentication.
- BFF pattern: keep tokens on a server-side session for SPAs to avoid storing them in the browser.

## 22. How do you validate a JWT, and how do you revoke one?

**30s:** Verify the signature using the issuer's public key from the JWKS endpoint (matched by `kid`), then check `exp`, `nbf`, `iss`, `aud`, and any required scopes. Use RS256/ES256 for anything cross-service so only the issuer can sign. You can't truly revoke a self-contained JWT, so I keep access tokens short — 5 to 15 minutes — and revoke at the refresh token level. If instant revocation is a hard requirement, keep a deny-list of `jti` in Redis checked by the gateway, or use opaque tokens with introspection.

**Depth**
- Never accept `alg: none`; pin allowed algorithms.
- JWT is base64, not encrypted — don't put secrets in claims; use JWE if needed.
- Clock skew allowance ~60s.
- Header size: don't stuff hundreds of group claims into the token.

## 23. ADFS: SAML vs OIDC. SP-initiated vs IdP-initiated.

**30s:** ADFS is Microsoft's federation server. Older integrations use SAML 2.0 or WS-Federation — XML assertions posted to the app after login; newer ADFS versions also support OAuth2/OIDC, which is what I'd choose for a React + Spring app because it's JSON/JWT and Spring Security supports it natively. SP-initiated means the user starts at our app and is redirected to ADFS; IdP-initiated means they click the app from the ADFS portal and land with an assertion already — less secure because there's no request to bind to.

**Depth**
- Claims rules in ADFS map AD groups to roles/claims we consume.
- SAML: validate signature, `NotOnOrAfter`, audience, replay (assertion ID).
- Spring Security supports SAML2 as a service provider (`saml2Login`).
- Certificate rotation on the IdP is a common outage cause — monitor expiry.

## 24. How do you secure App2App (service-to-service) calls?

**30s:** Client Credentials grant — each service has its own client ID and secret (from Secrets Manager/Vault, rotated), gets a short-lived token from the auth server with narrow scopes, and the callee validates it like any JWT. For extra assurance, mTLS between services — in EKS that's usually a service mesh like Istio issuing workload certs. Inside AWS, IAM-based signing (SigV4) or IAM roles for service accounts is another App2App mechanism. Never share one "system" credential across services — you lose the ability to know who called and to revoke one.

**Depth**
- Token propagation: pass the user's token downstream when the call is on the user's behalf; use token exchange (RFC 8693) to narrow scopes/audience; use the service's own token for background work.
- Cache tokens until near expiry; don't call the auth server per request.
- Audience per API so a token for service A isn't accepted by B.

## 25. "Authentication and authorization at different layers of data processing" — what does that mean to you?

**30s:** Every hop has its own identity and its own enforcement point. At the API layer: OAuth2/JWT with scopes. At the messaging layer: Kafka SASL/OAUTHBEARER or mTLS plus topic ACLs so a producer can't read someone else's topic. At the compute layer: the Spark/Flink job runs under a workload identity — IRSA on EKS or an instance role — with least-privilege IAM. At the storage layer: S3 bucket policies, KMS key policies, Glue/Lake Formation permissions for table/column access, RDS IAM auth. At the data layer: row-level filtering, column masking, and tokenising PII before it lands in the lake. The principle is that a token or role that gets you in the front door shouldn't get you to raw data.

**Depth**
- Lake Formation for column/row-level grants across Athena/Spark/Redshift.
- Encrypt in transit everywhere; KMS with separate keys per data classification.
- Audit: CloudTrail + S3 access logs + application audit events with the caller identity.

---

# E. AWS

## 26. EC2 vs EKS vs Lambda — how do you choose?

**30s:** Lambda for event-driven, bursty, short-running work — S3 triggers, queue consumers, scheduled jobs — where I want zero ops and pay-per-use, and I can live with cold starts and a 15-minute limit. EKS for long-running services, especially many of them, where I want standard Kubernetes tooling, fine-grained scaling, and portability. EC2 directly when I need full control of the OS, licensed software, or something that doesn't containerise well. In practice: Spring Boot services on EKS, glue and async processors on Lambda, and EC2 only for the odd legacy component.

**Depth**
- Cost shape: Lambda cheap at low volume, expensive at sustained high throughput; EKS has a control-plane fee plus nodes but is efficient when dense.
- Fargate on EKS/ECS removes node management.
- Ops burden: patching nodes, upgrading K8s versions — factor the team's skills.

## 27. Walk me through deploying a Spring Boot service to EKS

**30s:** Build a slim container image — multi-stage Dockerfile, JRE base, non-root user, layered jar — push to ECR. A Helm chart or Kustomize defines a Deployment with resource requests/limits, liveness/readiness probes on Actuator, ConfigMaps for config and Secrets (from Secrets Manager via External Secrets), a Service, and an Ingress that the AWS Load Balancer Controller turns into an ALB. Horizontal Pod Autoscaler on CPU or a custom metric like request rate. The pod gets AWS permissions through IRSA — an IAM role bound to its service account — not node roles or static keys. CI/CD does build → scan → push → `helm upgrade`, with rolling updates and a rollback path.

**Depth**
- Set JVM memory relative to the container limit (`MaxRAMPercentage`).
- Pod Disruption Budgets, anti-affinity across AZs.
- Graceful shutdown: `preStop` sleep + Spring graceful shutdown so the ALB deregisters first.
- Observability: Prometheus scrape, Fluent Bit → CloudWatch/OpenSearch, OpenTelemetry traces.

## 28. Java on Lambda — how do you handle cold starts?

**30s:** Cold starts hurt Java because of JVM startup and class loading, especially with Spring. Mitigations: SnapStart, which snapshots the initialised JVM so restore takes milliseconds; provisioned concurrency for latency-sensitive endpoints; keep the deployment small and initialise clients outside the handler so they're reused; use tiered compilation level 1; and either avoid full Spring Boot in Lambda or use Spring Cloud Function with lazy init. For anything with steady traffic, I'd question whether Lambda is the right compute at all.

**Depth**
- Lambda memory setting also controls CPU — more memory can be cheaper by finishing faster.
- RDS Proxy to avoid connection storms from many concurrent Lambdas.
- Idempotent handlers: Lambda retries async invocations.
- DLQ / on-failure destinations.

## 29. RDS Multi-AZ vs read replica; how do you size connection pools?

**30s:** Multi-AZ is for availability — a synchronous standby in another AZ with automatic failover, not readable (unless Multi-AZ cluster). Read replicas are for scaling reads — asynchronous copies you can query, with replication lag, and can be promoted manually. For pools: each RDS instance class has a `max_connections` ceiling; every pod runs its own HikariCP pool, so pods × pool size must stay below that with headroom. Hikari's guidance is small pools — roughly cores × 2 — because more connections than the DB can run concurrently just queue inside the database instead of the app.

**Depth**
- Failover changes the DNS endpoint; drivers must not cache DNS forever (`networkaddress.cache.ttl`).
- Aurora: shared storage, faster failover, up to 15 replicas, reader endpoint.
- Watch replica lag before sending strongly-consistent reads to replicas.
- Encrypted at rest with KMS; IAM DB auth to avoid passwords.

## 30. ALB vs NLB

**30s:** ALB is layer 7 — it understands HTTP, so it can route by path or host, terminate TLS, do health checks on a URL, integrate with WAF, and authenticate with Cognito/OIDC. NLB is layer 4 — TCP/UDP, static IPs, ultra-low latency, preserves the client source IP, millions of requests per second. For REST services I use ALB; for non-HTTP protocols, gRPC needing pass-through, or when a partner needs a fixed IP to whitelist, I use NLB.

**Depth**
- ALB idle timeout default 60s — align with app and client timeouts.
- Sticky sessions exist but are a smell; keep services stateless.
- Cross-zone load balancing; target groups by IP mode for EKS pods.

## 31. IAM: how do you give an EKS pod access to S3 safely?

**30s:** IRSA — IAM Roles for Service Accounts. The cluster has an OIDC provider; I create an IAM role whose trust policy allows that provider for a specific namespace/service account, attach a least-privilege policy (this bucket, this prefix, `GetObject`/`PutObject` only), and annotate the Kubernetes service account. The AWS SDK in the pod picks up a projected token and assumes the role automatically. No access keys anywhere. The newer alternative is EKS Pod Identity, which does the same without managing the OIDC trust yourself.

**Depth**
- Policy evaluation: explicit deny > allow; SCPs at the org level; permission boundaries.
- Resource policies (bucket policy) + identity policies both apply for cross-account.
- `aws:SourceVpce` conditions to force access through a VPC endpoint.

---

# F. Terraform

## 32. How do you manage Terraform state?

**30s:** Remote state in S3 with versioning and encryption enabled, and state locking — historically a DynamoDB table, now S3's native lock file in newer Terraform. Never local state, never in git. One state file per environment and per logical stack so a blast radius is contained and `plan` stays fast. Access to the state bucket is restricted because state contains secrets in plain text.

**Depth**
- `terraform_remote_state` data source or SSM parameters to share outputs between stacks.
- `terraform state mv/rm/import` for refactors; `moved` blocks for renames without recreate.
- Lock stuck? `force-unlock` with the lock ID, carefully.

## 33. How do you structure Terraform for dev/UAT/prod?

**30s:** Reusable modules in a versioned module repo — `eks-service`, `rds`, `vpc` — with sensible variables. Then an environments layer: a directory per environment with its own backend config and `tfvars`, calling the modules with pinned versions. Same code, different inputs. Promotion is a pipeline: `plan` on PR with the output posted for review, `apply` on merge, prod requiring a manual approval. I avoid Terraform workspaces for environments because they share one backend and make prod mistakes easy.

**Depth**
- `for_each` over maps for repeated resources; avoid `count` with lists (index shifts destroy resources).
- Pin provider and Terraform versions; renovate bot for upgrades.
- Secrets via `aws_secretsmanager_secret_version` data sources, never in tfvars.
- Policy as code: `tflint`, `checkov`, OPA/Sentinel.

## 34. Someone changed a security group in the console. What happens?

**30s:** That's drift. The next `plan` shows Terraform wanting to revert it. I'd find out why it was changed — if it was a legitimate hotfix, I bring it into code and apply; if not, applying restores the intended state. To catch drift early I run scheduled `plan`s in CI that alert on non-empty diffs, and I restrict console write access so Terraform is the only writer.

---

# G. Microservices

## 35. The 12-factor app — which factors matter most in your experience?

**30s:** Config in the environment, not in the artifact — one image promoted through every environment. Stateless processes — nothing in local memory or disk that matters, so pods can be killed and scaled freely. Backing services as attached resources — the DB or queue is a URL you swap. Logs as event streams to stdout, shipped by the platform. Dev/prod parity — Testcontainers and the same image locally. Disposability — fast startup and graceful shutdown. The others: codebase, dependencies, build/release/run, port binding, concurrency, admin processes.

## 36. How do you decide service boundaries? What is a bounded context?

**30s:** A bounded context is a DDD term: a boundary inside which a model and its language are consistent — "Order" in Sales means something different from "Order" in Fulfilment, and that's fine as long as they're separate contexts with an explicit translation between them. I draw boundaries around business capabilities and data ownership: a service owns its data and is the only writer. Signs a boundary is wrong: two services always change together, or one constantly reads the other's tables. When I get it wrong, I'd rather merge two chatty services than keep a distributed monolith.

**Depth**
- Techniques: event storming, context mapping (upstream/downstream, ACL).
- Start with a modular monolith when the domain isn't understood yet; extract when you have evidence.
- Team topology matters — one team per context avoids coordination costs.

## 37. How do you handle a transaction across services?

**30s:** You don't — you accept eventual consistency and use a saga. Choreography: each service emits an event and the next reacts; simple but the flow is invisible. Orchestration: a coordinator drives the steps and issues compensations on failure; clearer, one more component. Either way, each step is a local transaction and failures are undone by compensating actions, not rollbacks. To publish events reliably I use the outbox pattern: write the event to an outbox table in the same DB transaction as the business change, then a relay publishes it to Kafka — so I never have a committed change with a lost event.

**Depth**
- Idempotent consumers, because at-least-once delivery.
- Timeouts and "pending" states in the domain model.
- Debezium/CDC as the outbox relay.
- 2PC/XA exists but is slow and fragile across heterogeneous systems.

## 38. Resilience patterns you've used

**30s:** Timeouts on every outbound call — the non-negotiable one. Retries with exponential backoff and jitter, only for idempotent operations and only on transient errors. Circuit breakers with Resilience4j so a failing dependency fails fast and gets a chance to recover. Bulkheads — separate thread pools or connection pools per dependency so one slow service doesn't consume all threads. Fallbacks where a degraded answer is acceptable — cached data, default values. Rate limiting at the gateway. And load-shedding: return 503 quickly rather than queueing forever.

**Depth**
- Retry storms: retries multiply load on a struggling service — use budgets.
- Chaos testing in staging.
- Health checks that don't cascade.

## 39. Design a highly available order service on AWS

Say it as a walkthrough; draw it if there's a whiteboard.

1. **Edge:** Route 53 → CloudFront/WAF → ALB across 3 AZs. TLS terminated at ALB.
2. **Auth:** JWT from the IdP validated at the gateway and again in the service; scopes per operation.
3. **Compute:** Spring Boot on EKS, 3+ replicas spread across AZs, HPA on request rate, PDBs, graceful shutdown.
4. **Write path:** `POST /orders` with `Idempotency-Key` → validate → write order + outbox row in one transaction to Aurora/RDS Multi-AZ → return 201.
5. **Events:** outbox relay publishes `OrderCreated` to Kafka (MSK) keyed by orderId for ordering; consumers: payment, inventory, notifications; sagas for the cross-service flow with compensation.
6. **Reads:** read replicas or a DynamoDB read model for order status; cache hot lookups in ElastiCache.
7. **Async work:** SQS + Lambda or K8s workers for emails/exports; DLQs.
8. **Data:** encryption at rest (KMS), backups, PITR; PII minimised.
9. **Observability:** structured logs with correlation IDs, Micrometer metrics, OpenTelemetry traces, alerts on p99 latency, error rate, consumer lag, saturation.
10. **Delivery:** blue/green or canary via Argo Rollouts; backward-compatible DB migrations with Flyway (expand → migrate → contract).
11. **DR:** multi-AZ by default; cross-region replicas and IaC to rebuild if the RTO demands it.

Then say what you'd cut for a smaller scale, and what breaks first as load grows (usually the DB — hence the read model and caching).

---

# H. Databases

## 40. A query is slow. Walk me through it.

**30s:** Get the execution plan — `EXPLAIN PLAN` in Oracle, `EXPLAIN ANALYZE` in Postgres — and look for full table scans on large tables, nested loops over big row counts, and stale statistics. Usual fixes in order: add or fix an index that matches the WHERE and ORDER BY (composite index column order matters — equality columns first, then range), avoid functions on indexed columns, fetch only needed columns, paginate, and check that the ORM isn't generating something silly. Then measure again. If the query is fundamentally aggregating millions of rows, consider a materialised view or moving it to a batch/reporting store.

**Depth**
- Covering index avoids table lookups.
- Bitmap indexes (Oracle) for low-cardinality columns in warehouses, not OLTP.
- Too many indexes slow writes; review unused ones.
- Bind variables to avoid hard parsing; connection-level statement caching.

## 41. Transaction isolation levels

**30s:** They trade consistency for concurrency. Read Uncommitted allows dirty reads. Read Committed — the default in Oracle and Postgres — prevents dirty reads but allows non-repeatable reads and phantoms. Repeatable Read prevents non-repeatable reads. Serializable makes transactions behave as if run one at a time. Oracle uses multi-version concurrency, so readers never block writers, and it supports Read Committed and Serializable. In practice I run Read Committed and handle the specific races with optimistic locking (`@Version`) or `SELECT … FOR UPDATE` where it matters.

**Depth**
- Deadlocks: two transactions locking rows in opposite order — fix by consistent ordering, shorter transactions, retry on deadlock error.
- Lost update: optimistic locking with a version column, return 409 to the client.

## 42. Cassandra data modelling and consistency

**30s:** Cassandra is query-first: you design one table per query pattern and denormalise freely, because there are no joins and no ad-hoc queries. The partition key decides which node holds the data and must be in every query; clustering columns define sort order within the partition. Keep partitions bounded — not unbounded time series under one key; bucket by day or month. Consistency is tunable per request: with replication factor 3, `LOCAL_QUORUM` reads and writes give strong consistency within a datacentre while tolerating one node down.

**Depth**
- Avoid: secondary indexes on high-cardinality columns, `ALLOW FILTERING`, large deletes (tombstones), read-before-write.
- Lightweight transactions (`IF NOT EXISTS`) are expensive — use sparingly.
- Compaction strategies: STCS default, LCS for read-heavy, TWCS for time series.

## 43. DynamoDB key design and hot partitions

**30s:** Every access pattern must be served by a partition key, optionally with a sort key, or by a GSI. Single-table design packs multiple entity types into one table using generic `PK`/`SK` with prefixes like `USER#123` / `ORDER#456`. Hot partitions happen when many requests hit one key — a status value, a single tenant — and a partition tops out at 3,000 RCU / 1,000 WCU. Fix by choosing a higher-cardinality key or write-sharding (append a random suffix and fan out reads). Adaptive capacity helps but doesn't rescue a bad key.

**Depth**
- GSI is eventually consistent, has its own capacity; LSI shares the partition key and has a 10 GB limit.
- Conditional writes for idempotency; transactions for multi-item atomicity (2× cost).
- Streams + Lambda for CDC; TTL for expiry.
- On-demand for unpredictable load; provisioned + autoscaling for steady.

## 44. SQL vs NoSQL — how do you choose?

**30s:** Relational when the data is relational — many entities with relationships, ad-hoc queries, reporting, strong transactions across rows. NoSQL when I know the access patterns up front and need horizontal scale, very high write throughput, flexible schema, or low-latency key-based lookups. Most systems I've built use both: Oracle or Postgres as the system of record and Cassandra or DynamoDB for high-volume events, sessions, or read models. The mistake is picking NoSQL for "scale" you don't have and then needing joins.

---

# I. Messaging: Kafka / SQS / SNS

## 45. Kafka fundamentals — partitions, consumer groups, ordering

**30s:** A topic is split into partitions; each partition is an ordered, append-only log. Producers choose a partition — by key hash if a key is given, so all events for one order land in one partition in order. A consumer group shares a topic's partitions among its members; each partition is read by exactly one consumer in the group, and offsets track progress. Ordering is guaranteed only within a partition, so choose the key to match the ordering you need. Parallelism is capped by partition count.

**Depth**
- Rebalancing when consumers join/leave; cooperative sticky assignor reduces stop-the-world.
- Retention by time/size; compacted topics keep latest per key.
- Replication factor 3, `min.insync.replicas=2`, `acks=all` for durability.
- Consumer lag is the key health metric.

## 46. Exactly-once processing — how do you get it?

**30s:** Kafka gives at-least-once by default, so duplicates happen on retries and rebalances. The producer side is fixed with `enable.idempotence=true`, which dedupes retries per partition. True exactly-once within Kafka uses transactions for read-process-write pipelines. But when the sink is a database or an external API, I make the *consumer* idempotent: store the processed event ID with the business write in the same transaction, or use an upsert with a natural key, or an idempotency table with TTL. That's what actually works end-to-end.

**Depth**
- Commit offsets after processing, not before; manual acks.
- Poison messages: retry topic with backoff, then DLQ with alerting.
- Handle out-of-order on the consumer with version numbers.

## 47. Kafka vs SQS vs SNS

**30s:** SQS is a queue: a message is consumed by one consumer and then gone; simple, serverless, FIFO option for ordering, DLQ built in. SNS is pub/sub fan-out: one message to many subscribers — SQS queues, Lambdas, email. Kafka is a distributed log: messages are retained and can be replayed, many independent consumer groups read the same data, very high throughput, ordering per partition, but you run or pay for a cluster. The SNS → SQS pattern gives cheap fan-out with per-consumer queues; Kafka wins for event sourcing, replay, stream processing, and very high volume.

**Depth**
- SQS visibility timeout vs Kafka offset semantics.
- SQS standard: at-least-once, best-effort ordering; FIFO: 300 msg/s per group without batching.
- MSK vs self-managed vs Confluent.

---

# J. Data Processing

## 48. Spark: what's a shuffle, and how do you deal with skew?

**30s:** A shuffle is when data has to move between executors — groupBy, join, distinct, repartition — and it's the expensive part of any job because of network and disk. Skew is when a few keys have most of the data, so one task runs for an hour while the rest finish in seconds. Fixes: enable Adaptive Query Execution which splits skewed partitions automatically; salt the hot keys by appending a random suffix and joining on the salted key; broadcast the small side of a join to avoid shuffling the big side; and filter early so less data reaches the shuffle.

**Depth**
- Narrow vs wide transformations; lazy evaluation until an action.
- Cache/persist only what's reused; unpersist.
- Partition count ≈ 2–3× cores; avoid tiny files on write (`coalesce`).
- Parquet with predicate pushdown and column pruning.
- Structured Streaming: micro-batches, watermarks for late data, checkpointing to S3 for recovery.

## 49. How would you design a data lake on AWS for our platform?

**30s:** Landing zone in S3 with raw data as received, immutable, partitioned by source and date. A processed zone in Parquet, partitioned by the query dimension (usually date), with a Glue Data Catalog on top so Athena, Spark on EMR/Glue, and Redshift Spectrum can all query it. Ingestion via Kafka → Spark Structured Streaming or Kinesis Firehose for streams, and batch jobs orchestrated by Airflow or Step Functions. Access controlled through Lake Formation for table/column grants, KMS per data classification, and PII tokenised in the processing layer. Java services expose APIs over the curated layer — query APIs with pagination and auth by data domain — rather than giving consumers S3 access.

**Depth**
- Small-file problem: compaction jobs; Iceberg/Delta/Hudi for ACID and schema evolution on S3.
- Data quality checks (Deequ/Great Expectations) gating promotion between zones.
- Lineage and catalog for discoverability.
- Cost: S3 lifecycle to IA/Glacier, Athena scans priced per TB — partitions and Parquet matter.

---

# K. Behavioral (STAR — prepare your own versions)

## 50. Tell me about the toughest production incident you owned.

Structure: what the customer saw → how you found it (logs, metrics, traces) → root cause → immediate fix → permanent fix → what you changed in process (alerting, runbook, test). Keep it under 3 minutes. Own a mistake if there was one — it lands better than a story where you were flawless.

Good root causes to draw from if yours is similar: missing timeout on an outbound call exhausting the thread pool; connection pool leak; a Kafka consumer stuck on a poison message; a deploy that changed a DB column non-backward-compatibly; JVM OOM in a container with the wrong `-Xmx`.

## 51. The client adds scope mid-sprint. What do you do?

Acknowledge, don't refuse. Quantify the impact in points/days. Offer the trade: "we can take this in if X moves to next sprint, or we can add it at the top of next sprint's backlog." Escalate to the PO/scrum master with options, not problems. Mention a real time you did this and what the client chose.

## 52. Tell me about a time you disagreed with a client or architect.

Show you argued with data (a spike, a benchmark, a risk list), that you disagreed respectfully and in the right forum, and that you committed fully once the decision was made — even if it went the other way. Bonus if you later proved right and handled that gracefully, or were proved wrong and said so.

## 53. How do you work with limited guidance?

Say what you actually do: read the code and the existing patterns first; write down your assumptions and share them early; ship a thin vertical slice to get feedback rather than waiting for a perfect spec; over-communicate status in writing for the offshore/onshore gap; ask for a decision when one is needed, with a recommendation attached. Give a concrete example.

## 54. Shift flexibility and working across offshore/onshore

Answer plainly. State what you can do, what you'd need (notice for shift changes, overlap windows), and show you've done it. They're checking for reliability, not enthusiasm.

---

# Quick self-test — can you answer these in one sentence?

1. Why doesn't `@Transactional` work on a private method?
2. What does `acks=all` protect against?
3. Why is `LOCAL_QUORUM` "strongly consistent" with RF=3?
4. What's the difference between liveness and readiness?
5. Why can't you revoke a JWT?
6. When is index-as-key acceptable in React?
7. Why does Terraform need state locking?
8. What's the outbox pattern for?
9. What's wrong with retrying a POST?
10. Why is `thenApply` wrong with an async function?
