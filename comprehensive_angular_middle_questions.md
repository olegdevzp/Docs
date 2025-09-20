# Comprehensive Angular Framework Questions for Middle-Level Developers

## Core Angular Concepts

1. What is the difference between `@Component` and `@Directive`?
2. Explain the Angular component lifecycle hooks and their execution order
3. What is dependency injection and how does it work in Angular?
4. What are Angular services and how do you create them?
5. Explain the difference between `OnPush` and `Default` change detection strategies
6. What is the purpose of `NgZone` and when would you use it?
7. How do you handle lazy loading of modules in Angular?
8. What are Angular pipes and how do you create custom pipes?
9. Explain the difference between template-driven and reactive forms
10. What is Angular CLI and what are its main commands?
11. What are Angular decorators and how do they work?
12. Explain the concept of Angular modules and their purpose
13. What is the difference between constructor and ngOnInit?
14. How does Angular's hierarchical injector work?
15. What are providers and how do they work in Angular?

## Change Detection & Performance

16. Explain Angular change detection and when to use `OnPush`
17. What is Zone.js and how does zone-less Angular work?
18. What are the performance implications of change detection?
19. How do you optimize Angular application performance?
20. What is OnPush change detection and when should you use it?
21. How do you implement virtual scrolling?
22. What are the benefits of using trackBy functions in ngFor?
23. How do you implement code splitting in Angular?
24. What is tree shaking and how does it work?
25. How do you optimize bundle size?
26. What are immutable patterns with `OnPush`?
27. Explain `markForCheck` vs `detectChanges`
28. How do you profile performance with Angular DevTools?
29. What are CD cycles and how to analyze them?
30. How do you handle list rendering performance with `trackBy`?

## RxJS and Observables

31. What are Observables and how do they differ from Promises?
32. Compare `switchMap`, `mergeMap`, `concatMap`, and `exhaustMap` with real use cases
33. How do you handle errors in RxJS streams?
34. What is the purpose of the `async` pipe?
35. How do you unsubscribe from Observables to prevent memory leaks?
36. What are Subjects and when would you use them?
37. Explain hot vs cold Observables
38. How do you combine multiple Observables?
39. How to multicast with `shareReplay` safely?
40. How do you prevent RxJS memory leaks in components/services?
41. What are the different types of Subjects (BehaviorSubject, ReplaySubject)?
42. How do you handle backpressure in RxJS?
43. What is the difference between `subscribe` and `tap`?
44. How do you test RxJS streams?
45. What are marble diagrams and how to read them?

## Signals (Angular 16+)

46. What are Angular Signals and how do they work?
47. Signals vs Observables: when to use each?
48. How do you create computed signals?
49. What is the difference between signals and observables?
50. How do you convert between signals and observables?
51. What are effect signals and when to use them?
52. How do signals integrate with change detection?
53. What are the benefits of using signals over observables?
54. How do you handle async operations with signals?
55. What is signal-based state management?

## Routing and Navigation

56. How do you implement routing in Angular?
57. What are route guards and what types exist?
58. How do you pass data between routes?
59. What is lazy loading and how do you implement it?
60. How do you handle route parameters and query parameters?
61. What is the difference between `router.navigate()` and `router.navigateByUrl()`?
62. How do you implement nested routing?
63. Routing with standalone APIs
64. `CanMatch` vs `CanLoad` vs `CanActivate`
65. What are preloading strategies and how to implement custom preloader?
66. How do you handle route resolvers?
67. What are auxiliary routes?
68. How do you implement route animations?
69. How do you handle router events?
70. What is the difference between absolute and relative navigation?

## Forms and Validation

71. What is the difference between template-driven and reactive forms?
72. How do you implement `ControlValueAccessor` for reusable form controls?
73. What are sync vs async validators?
74. How do you create custom validators?
75. How do you handle dynamic forms with `FormArray` and nested `FormGroup`s?
76. What is form validation and how to display errors?
77. How do you implement conditional validation?
78. What are form states (pristine, dirty, valid, invalid)?
79. How do you reset forms properly?
80. What is the difference between `setValue` and `patchValue`?
81. How do you handle file uploads in forms?
82. What are form builders and how to use them?
83. How do you implement cross-field validation?
84. What is debouncing in form validation?
85. How do you handle form arrays dynamically?

## Dependency Injection

86. What are DI tokens (`InjectionToken`) and multi providers?
87. Explain injector hierarchy in Angular
88. `providedIn: root` vs `any` vs `platform`
89. What is the difference between singleton and transient services?
90. How do you inject dependencies in standalone components?
91. What are optional dependencies?
92. How do you create factory providers?
93. What is forward reference and when to use it?
94. How do you handle circular dependencies?
95. What are injection scopes?

## Components and Templates

96. What are standalone components vs NgModules?
97. How do you handle component communication?
98. What is content projection (single/multi-slot)?
99. Explain `ng-content select`
100. What are view queries vs content queries?
101. Explain `@ViewChild` options
102. What is the difference between `*ngIf` vs `[hidden]`?
103. How do you use `ng-template`, `ng-container`?
104. What are Angular 17 control flow features (`@if`, `@for`, `@defer`)?
105. How do you handle dynamic component loading?
106. What are component factories?
107. How do you pass data to dynamically created components?
108. What is view encapsulation and its modes?
109. How do you use `:host` and `::ng-deep`?
110. What are host bindings and host listeners?

## HTTP and APIs

111. How do you make HTTP requests in Angular?
112. What are HTTP interceptors and how do you use them?
113. How do you handle HTTP errors globally?
114. How do you implement caching for HTTP requests?
115. What is the difference between `HttpClient` and the old `Http` service?
116. How do you handle authentication with HTTP interceptors?
117. What are HTTP retry mechanisms and backoff strategies?
118. How do you cancel HTTP requests?
119. How do you handle file uploads and downloads?
120. What are HTTP headers and how to set them?
121. How do you mock HTTP requests for testing?
122. What is CORS and how to handle it?
123. How do you implement request/response transformation?
124. What are HTTP progress events?
125. How do you handle concurrent HTTP requests?

## State Management

126. What are the different approaches to state management in Angular?
127. How does NgRx work and what are its core concepts?
128. What are effects in NgRx and when do you use them?
129. How do you handle side effects in Angular applications?
130. What is the difference between local component state and global state?
131. NgRx/ComponentStore vs service-with-RxJS vs Signals Store
132. What are reducers and how do they work?
133. What are selectors in NgRx?
134. How do you handle async operations in NgRx?
135. What is the Entity pattern in NgRx?
136. How do you implement optimistic updates?
137. What are NgRx best practices?
138. How do you debug NgRx applications?
139. What is ComponentStore and when to use it?
140. How do you handle state persistence?

## Testing

141. What testing frameworks are commonly used with Angular?
142. How do you write unit tests for Angular components?
143. What is the difference between shallow and deep component testing?
144. How do you mock dependencies in Angular tests?
145. How do you test HTTP requests in Angular?
146. What are end-to-end tests and how do you implement them?
147. Testing standalone components with `TestBed`
148. How to use `fakeAsync` and Http testing?
149. What are test doubles (mocks, stubs, spies)?
150. How do you test reactive forms?
151. How do you test async operations?
152. What is code coverage and how to measure it?
153. How do you test custom pipes?
154. How do you test services with dependencies?
155. What are integration tests vs unit tests?

## Advanced Topics

156. What are Angular Elements and when would you use them?
157. How do you implement internationalization (i18n) in Angular?
158. What is Angular Universal and server-side rendering?
159. How do you implement Progressive Web App features in Angular?
160. What are Angular schematics and how do you create them?
161. How do you create custom Angular libraries?
162. What is Ivy renderer and what are its benefits?
163. What is `CUSTOM_ELEMENTS_SCHEMA`?
164. How do you use `$localize` and ICU expressions?
165. What are runtime vs build-time i18n approaches?
166. How do you implement SSR and hydration?
167. What is `TransferState` in Angular Universal?
168. How do you implement PWA with Angular Service Worker?
169. What are caching strategies for PWAs?
170. How do you handle service worker updates?

## Architecture and Best Practices

171. How do you structure a large Angular application?
172. What are Angular best practices for component communication?
173. How do you implement error handling in Angular applications?
174. What is the difference between smart and dumb components?
175. How do you implement authentication and authorization?
176. What are Angular style guides and why are they important?
177. How do you handle environment-specific configurations?
178. What are micro-frontends and how to implement them?
179. How do you implement feature modules?
180. What is the single responsibility principle in Angular?
181. How do you handle shared modules?
182. What are barrel exports?
183. How do you implement lazy loading strategies?
184. What are the SOLID principles in Angular?
185. How do you handle code organization and folder structure?

## TypeScript Integration

186. How does TypeScript enhance Angular development?
187. What are Angular decorators and how do they work?
188. How do you use TypeScript interfaces in Angular?
189. What are generic types and how do you use them in Angular?
190. How do you implement type-safe HTTP requests?
191. What are utility types in TypeScript?
192. How do you use enums in Angular?
193. What is type assertion and type guards?
194. How do you handle optional properties?
195. What are mapped types and conditional types?

## Build and Deployment

196. How do you configure Angular build process?
197. What are build optimization techniques?
198. How do you set up budgets and source maps?
199. What is strict TypeScript mode?
200. How do you implement environment configurations?
201. What are Angular build targets?
202. How do you optimize for production builds?
203. What is differential loading?
204. How do you implement build-time optimizations?
205. What are build analyzers and how to use them?

## Accessibility and CDK

206. How do you implement accessibility in Angular?
207. What are CDK a11y utilities (`FocusMonitor`, `LiveAnnouncer`)?
208. How do you use CDK Overlay/Portals?
209. What are positioning and scroll strategies?
210. How do you implement keyboard navigation?
211. What are ARIA attributes and how to use them?
212. How do you handle focus management?
213. What are screen reader considerations?
214. How do you test accessibility?
215. What are CDK layout utilities?

## Modern Angular Features

216. What are directive input coercion and best practices?
217. How do you use `takeUntilDestroyed` and `DestroyRef`?
218. What are pure vs impure pipes and their performance impact?
219. How does `AsyncPipe` work with OnPush?
220. What are the new control flow features in Angular 17?
221. How do you use `@defer` for lazy loading?
222. What are signal inputs and outputs?
223. How do you migrate from NgModules to standalone?
224. What are the benefits of standalone APIs?
225. How do you handle migration strategies?

## Error Handling and Debugging

226. How do you implement global error handling?
227. What is `ErrorHandler` and router errors?
228. How do you handle async errors?
229. What are debugging techniques in Angular?
230. How do you use browser dev tools with Angular?
231. What are common Angular errors and solutions?
232. How do you implement logging strategies?
233. What are error boundaries in Angular?
234. How do you handle network errors?
235. What are debugging tools and extensions?

## Security

236. What are Angular security best practices?
237. How do you prevent XSS attacks?
238. What is Content Security Policy (CSP)?
239. How do you handle authentication tokens securely?
240. What are CSRF attacks and prevention?
241. How do you sanitize user input?
242. What are trusted types?
243. How do you implement secure HTTP communication?
244. What are security headers?
245. How do you handle sensitive data?

## Migration and Upgrades

246. How do you upgrade Angular versions?
247. What are breaking changes to watch for?
248. How do you migrate from AngularJS to Angular?
249. What are migration tools and strategies?
250. How do you handle deprecated APIs?
251. What is ng update and how to use it?
252. How do you handle third-party library updates?
253. What are migration schematics?
254. How do you test after migrations?
255. What are rollback strategies?
