💡 Junior
Node.js
1. What is Node.js?
2. What are the main advantages and disadvantages of using Node.js?
3. What kinds of tasks is Node.js not suitable for?
4. What are the main components of Node.js?
5. How can a Node.js server handle many concurrent parallel requests from clients while having only one thread?
6. Is it possible to use multiple threads? Which modules are used to implement this?
7. Does Node.js interpret or compile program code?
8. How do you read large files using Node.js?
9. What are libuv and V8? What are they used for?
10. What is the difference between microtasks and macrotasks? Provide examples of such tasks.
11. What is a stream?
12. What types of streams do you know?
13. What is the event loop? What components does it consist of and how does it work?
14. What are logging and monitoring?
15. What is the difference between a monolith and a microservice?
16. What is the difference between the language keywords string and String?

Express.js
17. What is middleware used for?
18. How do you move from one middleware to another?
19. How do you prioritize middleware?
20. How do you organize an error handler?

JavaScript
21. What are asynchrony and asynchronous code?
22. What is the difference between var, let, and const? Why should you use const if a variable will not change later in the code?
23. How do you delay the execution of a function for a specific amount of time?
24. What ways of declaring a function do you know?
25. What is an anonymous function?
26. Provide examples of a self-invoking function.
27. What is the difference between a function expression and a function declaration?
28. How do you get a new array from a JS array of numbers that contains only numbers greater than 10? Which array method should you use?
29. How do you remove an element from an array and an object?
30. What is the void type used for?
31. Where and why is super() used?
32. What is this used for and in which cases should you use it?
33. What is NaN and how is it used?
34. What is NPM? What alternatives do you know?
35. What are the advantages and disadvantages of NPM compared to Yarn/PNPM?
36. What Promise API methods do you know? What is the difference between them?
37. Describe the structure of an HTTP request/response.
38. What are new Set() and new Map()?
39. What are the logical operators && and ||, and how do they differ from the logical operator "??"?

Databases
40. Why are databases needed in applications?
41. What is an ORM and what is it used for?
42. What is a data migration? Why is it needed?
43. What is a transaction?
44. How do you update a column value in a table?
45. What can you use to filter a Users table by age?

WEB
46. What is Cross-Origin Resource Sharing (CORS)? Where does it occur?
47. How do you get a CORS error in the developer console?
48. Name the main HTTP methods for RESTful or CRUD applications.
49. What is DNS?

HTML + CSS
50. What ways of centering an element horizontally and vertically do you know?
51. How do you target all links whose href attribute ends with ".com"? How do you hide such links?
52. Can you implement click fixation using HTML + CSS? Provide an example.
53. What is "margin collapsing"?
54. What will be the distance between these two elements:

<div style="display: block">
  <div style="margin-bottom: 25px">AAA</div>
  <div style="margin-top: 21px">BBB</div>
</div>
Will the answer change if you change display: block to display: flex?
55. Why do developers recommend placing script tags before the closing body tag? What happens if you put JS code in the head?
56. What are the defer and async attributes used for in the script tag?
57. What is the tabindex attribute? Where is it used?

Practical tasks
58. Provide example code to determine whether the number in the variable myNumber is divisible by 11 (true if yes; false if no)
59. How do you copy an array into a new variable without reference binding?
60. What will be printed to the console?
const trees = ["xyz", "xxxx", "test", "ryan", "apple"];
delete trees[3];
console.log(trees.length);
console.log(trees[3]);
61. You are given: const source = [1, 2, 3, 5, 1, 5, 9, 1, 2, 8]. Create an array with no duplicates, and an array containing only the values that were duplicated.
62. Given:
const obj = {
    name: "Vova",
    secondName: "Simba",
    age: 15,
    parents: {
        mother: {
            name: "Natali",
            secondName: "Simba",
            age: 38
        },
        father: {
            name: "Oleg",
            secondName: "Simba",
            age: 45,
            job: "driver"
        }
    }
};
Task: using destructuring, declare the variables motherName, motherSecondName, motherAge, motherJob, fatherInitials (an object with the father's first and last name, without age or job). If there is no job, use the value 'unemployed'.
63. Is there a difference between these ways of creating functions? If so, what is it?
function makeFunc() {}
let myFunc = function(); 
64. What is optional chaining in JS (?.)
let array;
array?.slice(1,3)
if (array?.length) {
array.slice(1,3)
}
65. Write an asynchronous ".map()" for an object using a callback. Note that the callback function is asynchronous; asyncObjectMap must return an object, not a promise.
function asyncObjectMap(obj, callback) {
    // code
}
await asyncObjectMap({ qwe: 123, fds: 32 }, async (x) => x * 2)
// => { qwe: 246, fds: 64 }
💡 Middle
Node.js
66. Name the advantages of Node.js compared to other technologies for building server-side applications.
67. For which tasks would you use multiple processes/threads?
68. What is the difference between parallel and asynchronous programming, using server-side applications as an example?
69. What types of asynchronous operations can Node.js perform?
70. What Node.js modules do you know? What is their main purpose?
71. What is the difference between operational errors and programmer errors?
72. What services can be used for monitoring and logging?
73. What is libuv? Name its components.
74. What distributed transaction patterns exist?
75. Is it possible to programmatically control memory allocation and deallocation in a Node.js program?
76. Explain what the Garbage Collector is.
77. What does a process "memory leak" mean? How do you prevent it?
78. How do you debug heap out of memory?
79. How do you configure caching?
80. What are the use cases for the child_process, worker_threads, and cluster modules?
81. What is the difference between using ES modules and CommonJS modules?
82. What is the EventEmitter class from the 'node:events' core module used for and how is it used?
83. How many CPU cores are involved when running a Node.js program by default?
84. What is middleware? If we write our own middleware, why there and not in the service code?
85. What is EventEmitter in Node.js?
86. What is the purpose of the package.json file for Node.js projects?
87. How can a Node.js app read a log file from the file system? How do you read a file larger than 300 megabytes?
88. Explain the event loop in Node.js.
89. What is the Thread Pool (Worker Pool) and why is it needed?
90. SIGTERM vs SIGINT: what are their advantages and disadvantages?
91. What is backpressure in the context of streams? How do you deal with it?
92. What are stream.PassThrough and pipe (pipeline) used for? Provide usage examples.
93. How do you use the 'data', 'end', 'error', and 'finish' events in Node.js streams?
94. How do you handle errors when working with streams in Node.js?
95. Provide examples of working with different types of streams.
96. Have you worked with pino?

NestJS
97. How do you describe a database connection?
98. How do you implement your own validation decorator?

JavaScript
99. Why is it not recommended to perform long computations in the JavaScript runtime?
100. Is setTimeout guaranteed to call a function after the specified time? What does it depend on?
101. What are Promises?
102. What is the difference between Promise.allSettled, Promise.race, and Promise.any?
103. What is a callback in JavaScript?
104. Are Promises better than the callback approach? Why?
105. What is a closure?
106. Explain the advantages and disadvantages of using "use strict".
107. Provide an example of blocking the event loop.
108. What is the difference between abstract and interface?
109. What are Web Workers? What are they used for?
110. What are the specifics of passing data between workers and the main thread?
111. What limitations are imposed on the Web Workers thread?
112. Besides using the 'return' operator, what other ways can you return a result from a function (procedure)?

Microservices
113. What is the difference between Monolith/SOA/Microservices?
114. Name the advantages and disadvantages of microservice architecture.
115. How do you ensure resilience and scalability of microservices?
116. How do you track failures?

Deployment and development process
117. What is CI (Continuous Integration)?
118. How is Docker used?
119. What is the difference between blue/green deployment and rolling deployment?

Networking, API
120. How does a browser know which page to load for a domain address?
121. What is the difference between HTTP and HTTPS?
122. How does HTTPS make a web application more secure?
123. What is a Socket? What is the difference between a Socket and long polling?
124. What popular architectural approach to API development do you know?
125. What is the difference between GraphQL and REST?
126. How would you design an API for bulk delete?

System Design
127. What is the CAP theorem?
128. How does horizontal scaling differ from vertical scaling?
129. What do you understand by load balancing? Why is it important when designing a system?
130. What is the concept of sync/async communication between services in a microservice architecture?
131. What popular methodologies for implementing async communication between services in a microservice architecture do you know? What are the pros and cons?

Security
132. What types of web application vulnerabilities do you know?
133. How do you protect against XSS?
134. How do you secure cookies?
135. What is CORS?
136. What is Content Security Policy?

Testing
137. Why write tests?
138. Why should unit tests be the foundation of the testing pyramid?
139. What is integration testing used for?
140. Why is unit testing needed?
141. Why is E2E testing needed?
142. Provide examples of bad integration and unit tests.
143. How would you test a complex database query in a repository class?
144. What types/volume of tests would you choose for a brand-new system with no constraints from the client?

Databases
145. What are database transactions? Why are they needed?
146. What transaction isolation levels exist? Pros and cons?
147. What is a foreign key? What role does it play?
148. What is a JOIN?
149. How does LEFT differ from INNER?
150. What are the advantages of SQL databases compared to NoSQL databases?
151. When should you use a NoSQL database instead of a relational database?
152. How can a database index improve performance?
153. What are the downsides of adding indexes?
154. What types of indexes exist and what is the difference between them?
155. What is the ACID property in a database?
156. How do you create an index for a relational database?

Practical tasks
157. How would you design a messaging application like WhatsApp or Facebook Messenger? Are real-time messaging apps typically standalone products or embedded features of larger systems?
158. What will be the output of the following code and why? Explain how this code is executed.

 console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
159. What are these methods used for:
  obj = Object.create(null);
and
  Object.defineProperty(obj, 'prop1', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: 'some-value'
  });
💡 Middle/Senior
Questions for a systems programmer
160. What problems, bugs, and bottlenecks in Node.js do you know?
161. What built-in serialization tools in Node.js do you know that are analogous to JSON but for binary serialization?
162. Why is Node.js not single-threaded? Prove that it has never been single-threaded.
163. What can replace the deprecated fs.exists?
164. What is back pressure for streams? What would its absence cause?
165. What are MessagePort and BroadcastChannel?
166. How do fs.stat, fs.fstat, and fs.lstat differ?
167. How are node:async_hooks and AsyncLocalStorage related?
168. What is missing in ESM that is supported in CJS?
169. How do you watch for changes to files and directories on disk? What problems can arise with this?
170. What can you do with node:vm?
171. How do you protect SharedArrayBuffer from writes from different worker_threads?
172. Prove that any module in Node.js is wrapped in a function when loaded and creates a closure.
173. Where is the Revealing constructor pattern used?
174. How do you override write for a Writable instance without creating a subclass?
175. What causes the slowness of calls from JavaScript code to C, C++ addons, or those connected via N-API?
176. Why is WASI needed and what capabilities does it provide?
177. What is new Error.captureStackTrace used for?
178. What deprecated APIs do you know and what is the strategy for phasing them out?
179. Why is it important to follow the eslint rule consistent-return from the perspective of V8 optimization?

Questions for an application Node.js programmer
180. Why should you add the node prefix when loading built-in modules?
181. What can you do with for await on request: IncomingMessage?
182. How do you copy a directory with nested files and other directories using node:fs?
183. Why is AbortController used? In which APIs is it supported?
184. What is the modern replacement for the node:domain API?
185. What API does nodejs/undici implement?
186. When can we use synchronous versions of file operations from node:fs instead of asynchronous ones? What should you consider when making this decision?
187. Provide best practices for error handling in asynchronous code.
188. How can vulnerabilities such as (choose one): XSS, Path traversal, SQLI, CSRF appear in Node.js projects? How do you protect against them?
189. How are race conditions possible in asynchronous programming?
190. What are the pros and cons of splitting code into .js and separate .d.ts typings?
191. Name several typical GoF design patterns and examples of their use in Node.js.
192. Which GoF pattern does EventEmitter implement?
193. What is the problem of fat controllers?
194. Provide examples of abstraction leaks in typical Node.js-based systems.
195. How can you create a singleton using the module system in Node.js?
196. Provide an example of the adapter pattern from built-in libraries.
197. Why do we need these Error fields: error.cause, error.code, error.message, error.stack?

💡 Senior
Node.js
198. What are the biggest problems with the Node.js platform?
199. How many threads does Node.js use for work? How can you regulate this number?
200. Can Node.js execute scripts written in other languages?
201. Is there a difference in microtask/macrotask execution depending on Node.js versions?
202. How do you work with built-in Node.js functions implemented via a callback interface in async/await style?
203. What is the difference between require/module.exports and ES6 modules?
204. What stages does the event loop in libuv consist of?
205. How does the libuv library achieve non-blocking I/O?
206. What are message delivery guarantees and what types exist?
207. In which cases would you apply asynchronous communication between two systems?
208. Can V8 be replaced in Node.js?
209. How do you configure logging and monitoring? What best practices do you know?
210. How would you use streams to improve web application performance?

Architecture
211. What are the ways to scale a Node.js server?
212. What are the advantages of clustering a Node.js application? What problems can arise?
213. What is the main difference or similarity in how web servers work on Node.js versus, for example, Apache (PHP)?
214. What is the Twelve-Factor App methodology?
215. Which monitoring metrics are most important?
216. Describe the SAGA design pattern. What is the difference between a transaction and a compensation operation in SAGA, in SOA?
217. What are authorization and authentication?
218. Express vs Nest.js: what are the advantages and disadvantages of each framework? When is each more appropriate to use?
219. What is CLS and where should it be used?
220. What is graceful shutdown? How do you implement it?
221. Provide examples of GoF pattern implementations in Node.js and frameworks.
222. Compare MessageQ, RabbitMQ, and Kafka.
223. What problems does serverless solve?

JavaScript
224. At what speed will data be retrieved by key from a regular JavaScript object? Explain what data structure this is and how it works.
225. How does JS differ from multithreaded languages?
226. What are higher-order functions?
227. Name first-class objects.
228. How do you determine whether your code/application has memory leaks?
229. How do you work with an asynchronous response?
230. How can you achieve encapsulation inside a class without using TypeScript?

Microservices
231. Tell us about your experience working with microservices in Node.js. How did you ensure communication between different services?
232. How have you worked with migration and improvement of services in a microservice architecture?
233. How would you approach testing and debugging an application with a microservice architecture in Node.js?
234. How would you handle failures in a distributed system (failed message processing, dead letter queue)?
235. What patterns for building microservice architecture have you used?
236. How does a gateway work?
237. What is the CAP theorem?
238. What is better: separate databases for separate microservices or one database for all microservices? Why?

Databases
239. What transaction isolation levels exist and how do they differ?
240. Why do transaction isolation levels exist? Provide examples.
241. What are transaction anomalies (dirty read, dirty write, read skew, phantom read, lost update)?
242. What is the difference between normalized and denormalized data? Provide an example of when each is better to use.
243. What is the difference between optimistic and pessimistic locking?
244. Why are search indexes needed? What are the downsides of indexes?
245. What is a race condition? Can you provide an example?
246. What is replication? Why is it needed?
247. What is the difference between a graph and a tree?
248. Have you ever optimized performance using data structures?
249. List the pros and cons of a Shared DB.
250. What are foreign keys and constraints in SQL databases?
251. What is database scaling? How do you do it?
252. What is sharding?
253. What is concurrent locking in a database?
254. Why are ACID properties important for SQL databases?
255. What is eventual consistency? What other types of consistency exist?
