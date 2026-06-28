# General Frontend Interview Questions (Middle/Senior Level)

*Questions not specific to JavaScript or particular frontend frameworks*

---

## Web Fundamentals & Protocols

1. Explain how HTTP/2 differs from HTTP/1.1 and what benefits it provides
2. What is HTTP/3 and how does it improve upon HTTP/2?
3. Explain the difference between HTTP and HTTPS
4. What happens when you type a URL into a browser and press Enter? (Detailed explanation)
5. Explain the difference between TCP and UDP protocols
6. What are WebSockets and when would you use them?
7. What is Server-Sent Events (SSE) and how does it differ from WebSockets?
8. Explain CORS (Cross-Origin Resource Sharing) and how to handle it
9. What are the different HTTP methods and their purposes?
10. What is the difference between PUT and PATCH?
11. Explain REST API principles and best practices
12. What is GraphQL and how does it differ from REST?
13. What are HTTP status codes? Explain the main categories
14. What is the purpose of HTTP headers?
15. Explain caching strategies in web applications

## Browser Concepts & Architecture

16. How does a browser rendering engine work?
17. Explain the Critical Rendering Path
18. What is the difference between layout, paint, and composite?
19. What is browser reflow and repaint? How to minimize them?
20. Explain the difference between parsing HTML and executing JavaScript
21. What is the browser's Event Loop? (General concept, not JS-specific)
22. How do browsers handle DNS resolution?
23. What is browser storage? Compare cookies, localStorage, sessionStorage, and IndexedDB
24. What are Service Workers and what can they do?
25. Explain the same-origin policy
26. What is the Browser Object Model (BOM)?
27. How do different browser engines (Blink, Gecko, WebKit) differ?
28. What is the difference between a web worker and the main thread?

## Performance Optimization

29. What are Core Web Vitals? Explain LCP, FID/INP, and CLS
30. How do you measure web performance?
31. What tools do you use for performance profiling?
32. Explain lazy loading and its benefits
33. What is code splitting and why is it important?
34. Explain the concept of critical CSS
35. What is tree shaking?
36. How do you optimize images for the web?
37. What are the benefits of using a CDN?
38. Explain different image formats (WebP, AVIF, JPEG, PNG) and when to use each
39. What is preloading, prefetching, and preconnecting?
40. How do you optimize web fonts?
41. What is the PRPL pattern?
42. Explain the concept of Progressive Web Apps (PWA)
43. What is server-side rendering (SSR) and what are its benefits?
44. What is static site generation (SSG)?
45. Explain the difference between SSR, SSG, and client-side rendering
46. What is Incremental Static Regeneration (ISR)?
47. How do you handle performance in mobile devices?
48. What is the RAIL performance model?

## Security

49. What is XSS (Cross-Site Scripting) and how do you prevent it?
50. What is CSRF (Cross-Site Request Forgery) and how do you prevent it?
51. What is Content Security Policy (CSP)?
52. Explain SQL injection and how to prevent it
53. What is clickjacking and how do you prevent it?
54. What are security headers and which ones are important?
55. Explain HTTPS and SSL/TLS certificates
56. What is certificate pinning?
57. How do you securely store sensitive data on the client side?
58. What is the principle of least privilege?
59. Explain authentication vs authorization
60. What is JWT and what are its security considerations?
61. What is OAuth 2.0 and OpenID Connect?
62. What are the OWASP Top 10 vulnerabilities?
63. How do you handle sensitive data in logs?
64. What is Subresource Integrity (SRI)?

## HTML & Semantics

65. Why is semantic HTML important?
66. What are the new HTML5 semantic elements?
67. Explain the difference between `<section>`, `<article>`, and `<div>`
68. What is the purpose of the `<meta>` tag?
69. Explain Open Graph protocol and its importance
70. What are HTML5 form validation features?
71. What is the difference between `id` and `class` attributes?
72. Explain data attributes and when to use them
73. What is the purpose of the `alt` attribute in images?
74. What are microdata and structured data?
75. Explain the `<canvas>` element and its use cases
76. What is the `<template>` element?
77. What are Web Components?
78. Explain Shadow DOM
79. What is the difference between `<script>`, `<script async>`, and `<script defer>`?

## CSS & Styling

80. Explain the CSS Box Model
81. What is the difference between `margin` and `padding`?
82. Explain CSS specificity and how it's calculated
83. What is the CSS cascade?
84. Explain different CSS positioning (static, relative, absolute, fixed, sticky)
85. What is Flexbox and when would you use it?
86. What is CSS Grid and how does it differ from Flexbox?
87. Explain CSS custom properties (CSS variables)
88. What is the difference between `em`, `rem`, `px`, `%`, `vh`, and `vw`?
89. What are CSS preprocessors and why use them?
90. What is PostCSS and how does it differ from preprocessors?
91. Explain CSS-in-JS and its pros/cons
92. What is Critical CSS and how do you implement it?
93. Explain mobile-first vs desktop-first design
94. What are CSS media queries?
95. How do you handle responsive images in CSS?
96. What is the `will-change` CSS property?
97. Explain CSS containment
98. What are CSS animations vs transitions?
99. What is the CSS `contain` property?
100. Explain BEM, SMACSS, or other CSS methodologies

## Accessibility (a11y)

101. What is web accessibility and why is it important?
102. Explain WCAG guidelines and compliance levels
103. What is ARIA and when should you use it?
104. Explain the difference between ARIA roles, states, and properties
105. How do you make a website keyboard navigable?
106. What is focus management and why is it important?
107. What is skip navigation and why is it needed?
108. How do you test for accessibility?
109. What tools do you use for accessibility testing?
110. Explain screen reader compatibility
111. What is color contrast and why does it matter?
112. How do you handle accessible forms?
113. What are accessible modals/dialogs?
114. Explain semantic HTML's role in accessibility
115. What is the accessibility tree?

## Architecture & Design Patterns

116. What is component-based architecture?
117. Explain micro-frontends architecture
118. What is the Module pattern?
119. Explain the Observer pattern
120. What is the Singleton pattern?
121. What is the Factory pattern?
122. Explain MVC, MVP, and MVVM patterns
123. What is dependency injection?
124. Explain the concept of separation of concerns
125. What is the Single Responsibility Principle?
126. What are SOLID principles?
127. Explain DRY (Don't Repeat Yourself)
128. What is YAGNI (You Aren't Gonna Need It)?
129. What is technical debt?
130. How do you approach refactoring legacy code?
131. What is atomic design methodology?
132. Explain the concept of design systems

## Build Tools & Workflows

133. What is a module bundler and why is it needed?
134. Explain the difference between Webpack, Rollup, and Vite
135. What is tree shaking and how does it work?
136. What is hot module replacement (HMR)?
137. Explain the concept of source maps
138. What is transpiling vs compiling?
139. What is minification and why is it important?
140. Explain the difference between development and production builds
141. What is asset optimization?
142. How do you handle environment variables?
143. What is CI/CD and how does it apply to frontend?
144. Explain semantic versioning
145. What is npm/yarn/pnpm and their differences?
146. What is a monorepo and what are its benefits?
147. What are lock files and why are they important?

## Testing Strategies

148. What is the testing pyramid?
149. Explain the difference between unit, integration, and end-to-end tests
150. What is Test-Driven Development (TDD)?
151. What is Behavior-Driven Development (BDD)?
152. What is code coverage and is 100% coverage a good goal?
153. What are mocks, stubs, and spies?
154. How do you test accessibility?
155. What is visual regression testing?
156. What is snapshot testing?
157. How do you test responsive designs?
158. What is performance testing?
159. What is load testing vs stress testing?
160. How do you handle flaky tests?
161. What is continuous testing?

## Version Control & Collaboration

162. Explain Git workflow strategies (Git Flow, GitHub Flow, trunk-based)
163. What is the difference between merge and rebase?
164. What are Git hooks and how can they be useful?
165. How do you handle merge conflicts?
166. What is code review and what do you look for?
167. Explain the concept of pull requests/merge requests
168. What is pair programming?
169. How do you write good commit messages?
170. What is semantic commit messages (Conventional Commits)?

## SEO & Web Standards

171. What is SEO and why is it important for frontend developers?
172. How does client-side rendering affect SEO?
173. What are meta tags important for SEO?
174. Explain the robots.txt file
175. What is a sitemap.xml?
176. What are canonical URLs?
177. Explain structured data and Schema.org
178. What is the importance of page speed for SEO?
179. How do you implement internationalization (i18n)?
180. What is Progressive Enhancement vs Graceful Degradation?
181. What are web standards and why follow them?
182. What is the W3C?
183. Explain browser compatibility and how to handle it

## DevOps & Deployment

184. What is the difference between frontend and backend deployment?
185. What is a reverse proxy?
186. Explain static hosting vs dynamic hosting
187. What is containerization (Docker) and why use it?
188. What is serverless architecture?
189. What is edge computing?
190. How do you handle environment-specific configurations?
191. What is blue-green deployment?
192. What is canary deployment?
193. What is feature flagging?
194. How do you handle rollbacks?
195. What is monitoring and observability?
196. What are error tracking tools and why use them?
197. How do you handle logging in frontend applications?

## API Design & Integration

198. What makes a good API design?
199. What is API versioning and how do you handle it?
200. Explain rate limiting
201. What is pagination and different pagination strategies?
202. What is idempotency in APIs?
203. How do you handle authentication in API calls?
204. What is API documentation and why is it important?
205. What is the difference between synchronous and asynchronous APIs?
206. Explain long polling vs WebSockets
207. What is a webhook?

## Mobile & Cross-Platform

208. What is responsive design vs adaptive design?
209. What is mobile-first design?
210. Explain touch events vs mouse events
211. What is the viewport meta tag?
212. How do you handle different screen sizes and resolutions?
213. What is pixel density and how does it affect design?
214. What are Progressive Web Apps (PWA)?
215. What is the App Shell architecture?
216. How do you handle offline functionality?
217. What is the difference between native, hybrid, and web apps?

## Emerging Technologies & Trends

218. What is WebAssembly (WASM) and its use cases?
219. What are Edge Functions?
220. Explain JAMstack architecture
221. What is the Headless CMS approach?
222. What are Web APIs you're familiar with? (Geolocation, Notifications, etc.)
223. What is the Intersection Observer API?
224. What is the Resize Observer API?
225. What is the Mutation Observer API?
226. Explain WebRTC
227. What is Web Bluetooth/Web USB?
228. What are Container Queries in CSS?

## Problem-Solving & Soft Skills

229. How do you approach debugging a complex issue?
230. How do you prioritize technical debt vs new features?
231. How do you stay updated with frontend technologies?
232. How do you handle disagreements in code reviews?
233. How do you mentor junior developers?
234. How do you estimate project timelines?
235. How do you handle changing requirements?
236. Describe a challenging project you worked on
237. How do you balance performance with maintainability?
238. How do you make technology decisions?
239. How do you handle browser compatibility issues?
240. What's your approach to learning a new technology?

---

## Additional Topics to Discuss

- **Design Systems**: Component libraries, tokens, documentation
- **Micro-optimizations**: Resource hints, connection management
- **Analytics**: Tracking, user behavior, A/B testing
- **Internationalization**: RTL support, locale handling, date/time formatting
- **State Management**: Client-side state, cache management (general concepts)
- **Error Handling**: Error boundaries, fallback UIs, graceful degradation
- **Documentation**: Code documentation, API docs, README best practices
- **Team Collaboration**: Agile, Scrum, Kanban methodologies
- **Code Quality**: Linting, formatting, code standards
- **Dependency Management**: Package updates, security vulnerabilities
- **Browser DevTools**: Profiling, debugging, network analysis
- **Scalability**: Handling growth, architectural decisions
- **Maintainability**: Code readability, documentation, patterns

---

*This list covers general frontend engineering concepts applicable across different frameworks and languages, focusing on web fundamentals, architecture, performance, security, and best practices.*








