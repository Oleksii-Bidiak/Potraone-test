const fs = require('fs');
const { readFileSync } = fs;

function readNumbersFromFile(filename) {
  try {
    const data = readFileSync(filename, 'utf8');
    return [
      ...new Set(
        data
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => line !== '')
      ),
    ].map(String);
  } catch (err) {
    console.error('Помилка читання файлу:', err);
    return [];
  }
}

class DigitPuzzleSolver {
  constructor(numbers) {
    this.numbers = numbers;
    this.graph = new Map();
    this.buildGraph();
  }

  buildGraph() {
    for (let num of this.numbers) {
      let lastTwo = num.slice(-2);
      for (let other of this.numbers) {
        if (num !== other && other.startsWith(lastTwo)) {
          if (!this.graph.has(num)) {
            this.graph.set(num, new Set());
          }
          this.graph.get(num).add(other);
        }
      }
    }
  }

  dfs(current, visited = new Set()) {
    if (visited.has(current)) return '';

    visited.add(current);
    let longestPath = current;

    if (this.graph.has(current)) {
      for (let next of this.graph.get(current)) {
        let newPath = this.dfs(next, visited);
        let mergedPath = current + newPath.slice(2);
        if (mergedPath.length > longestPath.length) {
          longestPath = mergedPath;
        }
      }
    }

    return longestPath;
  }

  findLongestChain() {
    let longestSequence = '';
    for (let num of this.numbers) {
      let sequence = this.dfs(num);

      if (sequence.length > longestSequence.length) {
        longestSequence = sequence;
      }
    }
    return longestSequence;
  }
}

const filename = 'file.txt';
const numbers = readNumbersFromFile(filename);
const solver = new DigitPuzzleSolver(numbers);

console.time('Time');
console.log('Output:', solver.findLongestChain());
console.timeEnd('Time');
