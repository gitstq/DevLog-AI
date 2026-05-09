import sqlite3 from 'sqlite3';
import { LogEntry, SearchOptions } from '../types';
import { generateId } from '../utils/helpers';
import path from 'path';
import fs from 'fs';

export class Database {
  private db: sqlite3.Database;
  private dbPath: string;

  constructor(dbPath: string = './.devlog/devlog.db') {
    this.dbPath = dbPath;
    this.ensureDirectory();
    this.db = new sqlite3.Database(dbPath);
    this.init();
  }

  private ensureDirectory(): void {
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private init(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS logs (
        id TEXT PRIMARY KEY,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        content TEXT NOT NULL,
        type TEXT NOT NULL,
        tags TEXT DEFAULT '[]',
        category TEXT DEFAULT 'general',
        command TEXT,
        output TEXT,
        code_snippet TEXT,
        file_path TEXT,
        project TEXT,
        importance INTEGER DEFAULT 1,
        metadata TEXT DEFAULT '{}'
      );
      CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs(timestamp);
      CREATE INDEX IF NOT EXISTS idx_logs_category ON logs(category);
      CREATE INDEX IF NOT EXISTS idx_logs_project ON logs(project);
    `);
  }

  async create(entry: Omit<LogEntry, 'id'>): Promise<LogEntry> {
    const id = generateId();
    const sql = `
      INSERT INTO logs (id, timestamp, content, type, tags, category, command, 
        output, code_snippet, file_path, project, importance, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      id, entry.timestamp.toISOString(), entry.content, entry.type,
      JSON.stringify(entry.tags), entry.category, entry.command || null,
      entry.output || null, entry.codeSnippet || null, entry.filePath || null,
      entry.project || null, entry.importance, JSON.stringify(entry.metadata)
    ];

    return new Promise((resolve, reject) => {
      this.db.run(sql, params, (err) => {
        if (err) reject(err);
        else resolve({ ...entry, id });
      });
    });
  }

  async findById(id: string): Promise<LogEntry | null> {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM logs WHERE id = ?', [id], (err, row: any) => {
        if (err) reject(err);
        else resolve(row ? this.rowToEntry(row) : null);
      });
    });
  }

  async search(options: SearchOptions): Promise<LogEntry[]> {
    let sql = 'SELECT * FROM logs WHERE 1=1';
    const params: any[] = [];

    if (options.query) {
      sql += ' AND (content LIKE ? OR command LIKE ? OR output LIKE ?)';
      const likeQuery = `%${options.query}%`;
      params.push(likeQuery, likeQuery, likeQuery);
    }
    if (options.category) { sql += ' AND category = ?'; params.push(options.category); }
    if (options.type) { sql += ' AND type = ?'; params.push(options.type); }
    if (options.project) { sql += ' AND project = ?'; params.push(options.project); }
    if (options.startDate) { sql += ' AND timestamp >= ?'; params.push(options.startDate.toISOString()); }
    if (options.endDate) { sql += ' AND timestamp <= ?'; params.push(options.endDate.toISOString()); }
    if (options.importance) { sql += ' AND importance >= ?'; params.push(options.importance); }

    sql += ' ORDER BY timestamp DESC';
    if (options.limit) { sql += ' LIMIT ?'; params.push(options.limit); }

    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows: any[]) => {
        if (err) reject(err);
        else resolve(rows.map(row => this.rowToEntry(row)));
      });
    });
  }

  async getAll(limit?: number): Promise<LogEntry[]> {
    let sql = 'SELECT * FROM logs ORDER BY timestamp DESC';
    const params: any[] = [];
    if (limit) { sql += ' LIMIT ?'; params.push(limit); }

    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows: any[]) => {
        if (err) reject(err);
        else resolve(rows.map(row => this.rowToEntry(row)));
      });
    });
  }

  async getRecent(days: number = 7): Promise<LogEntry[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return this.search({ query: '', startDate, limit: 100 });
  }

  async delete(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM logs WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve(this.changes > 0);
      });
    });
  }

  async getStats(): Promise<{ total: number; byCategory: Record<string, number>; byType: Record<string, number>; byProject: Record<string, number> }> {
    const stats = { total: 0, byCategory: {} as Record<string, number>, byType: {} as Record<string, number>, byProject: {} as Record<string, number> };

    const totalResult: any = await new Promise((resolve, reject) => {
      this.db.get('SELECT COUNT(*) as count FROM logs', (err, row) => {
        if (err) reject(err); else resolve(row);
      });
    });
    stats.total = totalResult.count;

    const categoryRows: any[] = await new Promise((resolve, reject) => {
      this.db.all('SELECT category, COUNT(*) as count FROM logs GROUP BY category', (err, rows) => {
        if (err) reject(err); else resolve(rows);
      });
    });
    categoryRows.forEach(row => { stats.byCategory[row.category] = row.count; });

    const typeRows: any[] = await new Promise((resolve, reject) => {
      this.db.all('SELECT type, COUNT(*) as count FROM logs GROUP BY type', (err, rows) => {
        if (err) reject(err); else resolve(rows);
      });
    });
    typeRows.forEach(row => { stats.byType[row.type] = row.count; });

    const projectRows: any[] = await new Promise((resolve, reject) => {
      this.db.all('SELECT project, COUNT(*) as count FROM logs WHERE project IS NOT NULL GROUP BY project', (err, rows) => {
        if (err) reject(err); else resolve(rows);
      });
    });
    projectRows.forEach(row => { stats.byProject[row.project] = row.count; });

    return stats;
  }

  private rowToEntry(row: any): LogEntry {
    return {
      id: row.id,
      timestamp: new Date(row.timestamp),
      content: row.content,
      type: row.type,
      tags: JSON.parse(row.tags || '[]'),
      category: row.category || 'general',
      command: row.command,
      output: row.output,
      codeSnippet: row.code_snippet,
      filePath: row.file_path,
      project: row.project,
      importance: row.importance || 1,
      metadata: JSON.parse(row.metadata || '{}')
    };
  }

  close(): void {
    this.db.close();
  }
}
