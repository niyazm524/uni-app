import { IComment, IRequest } from "@/lib/data-storage/models";
import { CapacitorSQLite, SQLiteDBConnection } from "@capacitor-community/sqlite";
import { reactive } from "vue";
import { SQLiteHook } from "vue-sqlite-hook";
import sqlSchema from './schema.json';

const DB_NAME= 'uni-db'
export const sqlStore = reactive({
  logs: 'logs will be here. ',
  sql: {} as SQLiteHook,
  con: {} as SQLiteDBConnection
})

export async function initSql(sql: SQLiteHook) {
  if(sqlStore.sql.isAvailable && sqlStore.con.getConnectionDBName?.()) return;
  sqlStore.sql = sql;
  const isDbExists = await sql.isDatabase(DB_NAME)
  if(!isDbExists.result)
    await sql.importFromJson(JSON.stringify(sqlSchema))
  sqlStore.con = await sql.createConnection(DB_NAME, false)
  await sqlStore.con.open()
  if(!(await sqlStore.con.isTable('requests').then((r) => r.result))) {
    throw new Error('No tables created')
  }
  return sqlStore;
}

export async function destroySql() {
  await CapacitorSQLite.close({database: DB_NAME})
}

const sql = {
  execute: (statements: string) => sqlStore.con.execute(statements),
  query: <T>(/* language=SQLite */ statement: string, ...values: any[]) => sqlStore.con.query(statement, values).then((r) => r.values as T[])
} as const;

export const storage = {
  requests: {
    load:
      (): Promise<IRequest[]> => sql.query('SELECT * FROM requests ORDER BY created_at DESC'),
    modify: (request: IRequest) => sql.execute(`INSERT OR REPLACE INTO requests (id, title, body, position) VALUES (${request.id || 'NULL'}, '${request.title}', '${request.body}', ${request.position ? `'${request.position}'` : 'NULL'})`)
  },

  comments: {
    load: (reqId: number) =>
      sql.query<IComment>(`SELECT * FROM comments WHERE request_id = ${reqId} ORDER BY created_at DESC`),
    add: (comment: IComment) =>
      sql.execute(`INSERT INTO comments (username, text, request_id) VALUES ('${comment.username}', '${comment.text}', ${comment.request_id});`)
  }
}
