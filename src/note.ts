import { Elysia, t } from "elysia";
import { getUserId } from '@/user'

const memo = t.Object({
  data: t.String(),
  author: t.String(),
})

type Memo = typeof memo.static

class Note {
  constructor(
    public data: Memo[] = [
      {
        data: 'Moonhalo',
        author: 'saltyaom',
      }
    ]
  ) {}

  add(note: Memo) {
    this.data.push(note)

    return this.data
  }

  remove(index: number) {
    return this.data.splice(index, 1)
  }

  update(index: number, note: Partial<Memo>) {
    return (this.data[index] = { ...this.data[index], ...note })
  }
}

export const note = new Elysia({ 
  prefix: '/note', 
  detail: {
    tags: ['Note']
  } 
})
  // .use(getUserId)
  .decorate('note', new Note())
  .model({
    memo: t.Omit(memo, ['author']),
  })
  .use(getUserId)
  .get('/', ({ note }) => note.data)
  .post('/', ({ note, body: { data }, user }) => note.add({ data, author: user.name }), {
    body: 'memo',
  })
  .guard({
    params: t.Object({
      index: t.Number(),
    }),
  })
  .get('/:index', ({ note, params: { index }, error }) => {
    return note.data[index] ?? error(404)
  })
  .delete('/:index', ({ note, params: { index }, error}) => {
    if (index in note.data) return note.remove(index)
      return error(422)
  })
  .patch('/:index', ({ note, params: { index }, body: { data }, error, user }) => {
    if (index in note.data) return note.update(index, { data, author: user.name })
      return error(422)
  }, {
    body: 'memo',
  })

