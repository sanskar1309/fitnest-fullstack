import Database from 'better-sqlite3';
import fs from 'fs';

const db = new Database('db/database.db');

// Export difficulty
const difficultyStmt = db.prepare('SELECT * FROM difficulty');
const difficultyData = difficultyStmt.all();
fs.writeFileSync('difficulty.json', JSON.stringify(difficultyData, null, 2));

// Export poses
const posesStmt = db.prepare('SELECT * FROM poses');
const posesData = posesStmt.all();
fs.writeFileSync('poses.json', JSON.stringify(posesData, null, 2));

// Export categories
const categoriesStmt = db.prepare('SELECT * FROM categories');
const categoriesData = categoriesStmt.all();
fs.writeFileSync('categories.json', JSON.stringify(categoriesData, null, 2));

// Export transitive_poses
const transitiveStmt = db.prepare('SELECT * FROM transitive_poses');
const transitiveData = transitiveStmt.all();
fs.writeFileSync('transitive_poses.json', JSON.stringify(transitiveData, null, 2));

console.log('Data exported to JSON files successfully!');

db.close();
