/**
 * Primary Recursion vs Tail Recursion in JavaScript
 * 
 * This example demonstrates the key differences between primary (regular) recursion
 * and tail recursion, including performance implications and optimization opportunities.
 */

// ============================================================================
// PRIMARY RECURSION (Regular Recursion)
// ============================================================================

/**
 * Primary Recursion Characteristics:
 * - The recursive call is NOT the last operation in the function
 * - Additional computation happens after the recursive call returns
 * - Each recursive call must wait for the next call to complete
 * - Uses more stack space (O(n) space complexity)
 * - Cannot be optimized by JavaScript engines in most cases
 */

// Example 1: Factorial using Primary Recursion
function factorialPrimary(n: number): number {
    // Base case
    if (n <= 1) {
        return 1;
    }
    
    // Recursive case - computation happens AFTER the recursive call
    // This is NOT tail recursion because we multiply after the call returns
    return n * factorialPrimary(n - 1);
}

// Example 2: Fibonacci using Primary Recursion
function fibonacciPrimary(n: number): number {
    if (n <= 1) {
        return n;
    }
    
    // Two recursive calls with computation after each returns
    return fibonacciPrimary(n - 1) + fibonacciPrimary(n - 2);
}

// Example 3: Sum of Array using Primary Recursion
function sumArrayPrimary(arr: number[], index: number = 0): number {
    if (index >= arr.length) {
        return 0;
    }
    
    // Computation happens after recursive call
    return arr[index] + sumArrayPrimary(arr, index + 1);
}

// ============================================================================
// TAIL RECURSION
// ============================================================================

/**
 * Tail Recursion Characteristics:
 * - The recursive call is the LAST operation in the function
 * - No computation happens after the recursive call
 * - Can be optimized by JavaScript engines (Tail Call Optimization - TCO)
 * - Uses constant stack space (O(1) space complexity) when optimized
 * - More memory efficient for large inputs
 */

// Example 1: Factorial using Tail Recursion
function factorialTail(n: number, accumulator: number = 1): number {
    // Base case
    if (n <= 1) {
        return accumulator;
    }
    
    // Tail call - recursive call is the last operation
    // All computation happens BEFORE the recursive call
    return factorialTail(n - 1, n * accumulator);
}

// Example 2: Fibonacci using Tail Recursion
function fibonacciTail(n: number, a: number = 0, b: number = 1): number {
    if (n === 0) return a;
    if (n === 1) return b;
    
    // Tail call - no computation after recursive call
    return fibonacciTail(n - 1, b, a + b);
}

// Example 3: Sum of Array using Tail Recursion
function sumArrayTail(arr: number[], index: number = 0, accumulator: number = 0): number {
    if (index >= arr.length) {
        return accumulator;
    }
    
    // Tail call - computation happens before recursive call
    return sumArrayTail(arr, index + 1, accumulator + arr[index]);
}

// ============================================================================
// COMPARISON AND PERFORMANCE ANALYSIS
// ============================================================================

/**
 * Performance Comparison:
 * 
 * Primary Recursion:
 * - Space Complexity: O(n) - grows with input size
 * - Time Complexity: Same as tail recursion for most algorithms
 * - Stack Overflow Risk: High for large inputs
 * - Memory Usage: High due to call stack
 * 
 * Tail Recursion:
 * - Space Complexity: O(1) when optimized, O(n) when not optimized
 * - Time Complexity: Same as primary recursion
 * - Stack Overflow Risk: Low when optimized
 * - Memory Usage: Low when optimized
 */

// Performance testing function
function performanceTest() {
    const testValue = 1000;
    const testArray = Array.from({ length: 1000 }, (_, i) => i + 1);
    
    console.log('=== Performance Comparison ===');
    
    // Test factorial functions
    console.time('Primary Factorial');
    try {
        const result1 = factorialPrimary(testValue);
        console.log(`Primary factorial result: ${result1}`);
    } catch (error) {
        console.log('Primary factorial: Stack overflow');
    }
    console.timeEnd('Primary Factorial');
    
    console.time('Tail Factorial');
    try {
        const result2 = factorialTail(testValue);
        console.log(`Tail factorial result: ${result2}`);
    } catch (error) {
        console.log('Tail factorial: Stack overflow');
    }
    console.timeEnd('Tail Factorial');
    
    // Test array sum functions
    console.time('Primary Array Sum');
    try {
        const result3 = sumArrayPrimary(testArray);
        console.log(`Primary array sum result: ${result3}`);
    } catch (error) {
        console.log('Primary array sum: Stack overflow');
    }
    console.timeEnd('Primary Array Sum');
    
    console.time('Tail Array Sum');
    try {
        const result4 = sumArrayTail(testArray);
        console.log(`Tail array sum result: ${result4}`);
    } catch (error) {
        console.log('Tail array sum: Stack overflow');
    }
    console.timeEnd('Tail Array Sum');
}

// ============================================================================
// TAIL CALL OPTIMIZATION (TCO) IN JAVASCRIPT
// ============================================================================

/**
 * Tail Call Optimization:
 * - Available in ES6+ (ES2015)
 * - Only works in strict mode
 * - Replaces recursive calls with loops at the engine level
 * - Reduces memory usage and prevents stack overflow
 */

// Example with strict mode for TCO
function factorialTailOptimized(n: number, accumulator: number = 1): number {
    'use strict'; // Required for TCO
    
    if (n <= 1) {
        return accumulator;
    }
    
    // This should be optimized by the JavaScript engine
    return factorialTailOptimized(n - 1, n * accumulator);
}

// ============================================================================
// CONVERTING PRIMARY TO TAIL RECURSION
// ============================================================================

/**
 * Steps to convert primary recursion to tail recursion:
 * 1. Add an accumulator parameter
 * 2. Move all computation before the recursive call
 * 3. Pass the computed result as the accumulator
 * 4. Return the accumulator in the base case
 */

// Example: Converting primary to tail recursion
function powerPrimary(base: number, exponent: number): number {
    if (exponent === 0) {
        return 1;
    }
    
    // Primary recursion - computation after recursive call
    return base * powerPrimary(base, exponent - 1);
}

function powerTail(base: number, exponent: number, accumulator: number = 1): number {
    if (exponent === 0) {
        return accumulator;
    }
    
    // Tail recursion - computation before recursive call
    return powerTail(base, exponent - 1, base * accumulator);
}

// ============================================================================
// PRACTICAL EXAMPLES
// ============================================================================

// Example 1: Binary Search (Tail Recursive)
function binarySearchTail(
    arr: number[], 
    target: number, 
    left: number = 0, 
    right: number = arr.length - 1
): number {
    if (left > right) {
        return -1; // Not found
    }
    
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
        return mid;
    } else if (arr[mid] < target) {
        return binarySearchTail(arr, target, mid + 1, right);
    } else {
        return binarySearchTail(arr, target, left, mid - 1);
    }
}

// Example 2: Tree Traversal (Tail Recursive)
interface TreeNode {
    value: number;
    left?: TreeNode;
    right?: TreeNode;
}

function treeSumTail(node: TreeNode | undefined, accumulator: number = 0): number {
    if (!node) {
        return accumulator;
    }
    
    // Process current node
    const currentSum = accumulator + node.value;
    
    // Tail recursive calls
    return treeSumTail(node.right, treeSumTail(node.left, currentSum));
}

// ============================================================================
// BEST PRACTICES
// ============================================================================

/**
 * When to use Primary Recursion:
 * - When the algorithm naturally requires computation after recursive calls
 * - For tree/graph algorithms where you need to combine results
 * - When readability is more important than performance
 * - For small inputs where stack overflow isn't a concern
 * 
 * When to use Tail Recursion:
 * - When you can restructure the algorithm to avoid post-recursive computation
 * - For large inputs where stack overflow is a concern
 * - When memory efficiency is critical
 * - When you want to take advantage of TCO
 * 
 * General Guidelines:
 * - Always consider iterative solutions as alternatives
 * - Use memoization for expensive recursive operations
 * - Test with edge cases and large inputs
 * - Profile performance in your specific use case
 * - Consider the trade-offs between readability and performance
 */

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

console.log('=== Primary vs Tail Recursion Examples ===');

// Small input examples
console.log('Factorial of 5:');
console.log('Primary:', factorialPrimary(5)); // 120
console.log('Tail:', factorialTail(5)); // 120

console.log('\nFibonacci of 10:');
console.log('Primary:', fibonacciPrimary(10)); // 55
console.log('Tail:', fibonacciTail(10)); // 55

console.log('\nArray sum:');
const testArr = [1, 2, 3, 4, 5];
console.log('Primary:', sumArrayPrimary(testArr)); // 15
console.log('Tail:', sumArrayTail(testArr)); // 15

console.log('\nPower calculation:');
console.log('Primary:', powerPrimary(2, 8)); // 256
console.log('Tail:', powerTail(2, 8)); // 256

console.log('\nBinary search:');
const sortedArr = [1, 3, 5, 7, 9, 11, 13, 15];
console.log('Index of 7:', binarySearchTail(sortedArr, 7)); // 3
console.log('Index of 6:', binarySearchTail(sortedArr, 6)); // -1

// Performance test (uncomment to run)
// performanceTest();

export {
    factorialPrimary,
    factorialTail,
    fibonacciPrimary,
    fibonacciTail,
    sumArrayPrimary,
    sumArrayTail,
    powerPrimary,
    powerTail,
    binarySearchTail,
    treeSumTail,
    factorialTailOptimized
};

